/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />

import {Http, RequestOptionsArgs} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/map';

import {deepmerge, slimify, CollectionItem} from './utilities';

@Injectable()
export abstract class RestCollection<T extends CollectionItem> {
    protected _baseUrl: string;
    protected _requestOptionsArgs: RequestOptionsArgs;
    private _http: Http;
    private _collection$: BehaviorSubject<T[]>;
    private _errors$: BehaviorSubject<any>;
    private _history$: Subject<any>;
    private _dataStore: { collection: T[] };
    private _historyStore: any[];

    constructor(restCollectionConfig: {
        baseUrl: string;
        http: Http;
        options?: RequestOptionsArgs;
    }) {
        this._collection$ = new BehaviorSubject(<T[]>[]);
        this._errors$ = new BehaviorSubject(<any>{});
        this._history$ = new BehaviorSubject(<any>{});

        this._baseUrl = restCollectionConfig.baseUrl;
        this._requestOptionsArgs = restCollectionConfig.options;
        this._http = restCollectionConfig.http;

        this._dataStore = { collection: [] };
        this._historyStore = [];
        this._recordHistory('INIT');
    }

    get collection$(): Observable<T[]> {
        return this._collection$; //.map(collection => this._clone(this._store.collection));
    }

    get errors$(): Observable<any> {
        return this._errors$;
    }

    get history$(): Observable<any> {
        return this._history$;
    }

    loadAll(options = ''): Observable<Array<T>> {
        let completion$ = new Subject();

        this._apiGet(`${this._baseUrl}?${options}`).subscribe(data => {
            this._updateCollection(data);
            this._recordHistory('LOAD_ALL');
            this._collection$.next(this._dataStore.collection);
            completion$.next(data);
            completion$.complete();
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    load(id: any, options = ''): Observable<T> {
        let completion$ = new Subject();

        this._apiGet(`${this._baseUrl}/${id}?${options}`).subscribe(data => {
            this._updateCollectionItem(data.id, data);
            this._recordHistory('LOAD');
            this._collection$.next(this._dataStore.collection);
            completion$.next(data);
            completion$.complete();
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    create(item: any, options: string = ''): Observable<T> {
        let completion$ = new Subject();

        this._apiPost(this._baseUrl, slimify(item)).subscribe(data => {
            this._addCollectionItem(data);
            this._recordHistory('CREATE');
            this._collection$.next(this._dataStore.collection);
            completion$.next(data);
            completion$.complete();
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    update(item: any): Observable<T> {
        let completion$ = new Subject();

        this._apiPut(`${this._baseUrl}/${item.id}`, slimify(item)).subscribe(data => {
            this._updateCollectionItem(item.id, data);
            this._recordHistory('UPDATE');
            this._collection$.next(this._dataStore.collection);
            completion$.next(data);
            completion$.complete();
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    remove(id: any): Observable<T> {
        let completion$ = new Subject();

        this._apiDelete(`${this._baseUrl}/${id}`).subscribe(response => {
            this._removeCollectionItem(id);
            this._recordHistory('REMOVE');
            this._collection$.next(this._dataStore.collection);
            completion$.next(null);
            completion$.complete();
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    protected _apiGet(url: string, opt?) {
        return this._http.get(url, Object.assign({}, this._requestOptionsArgs, opt)).map(res => res.json());
    }

    protected _apiPost(url: string, val, opt?) {
        let body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.post(url, body, Object.assign({}, this._requestOptionsArgs, opt)).map(res => res.json());
    }

    protected _apiPut(url: string, val, opt?) {
        let body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.put(url, body, Object.assign({}, this._requestOptionsArgs, opt)).map(res => res.json());
    }

    protected _apiDelete(url: string, opt?) {
        return this._http.delete(url, Object.assign({}, this._requestOptionsArgs, opt)).map(res => res.status);
    }

    protected _recordHistory(action: string) {
        if (this._historyStore.length >= 100) {
            this._historyStore.shift();
        } else {
            this._historyStore.push({ action, state: this._dataStore, resource: this._baseUrl });
            this._history$.next(this._historyStore);
        }
    }

    protected _updateCollection(collection: any[]) {
        this._dataStore = Object.assign({}, this._dataStore, { collection }); // need to add/merge not replace
    }

    protected _addCollectionItem(item: any) {
        this._dataStore = { collection: [...this._dataStore.collection, item] };
    }

    protected _updateCollectionItem(id: any, data: any) {
        let notFound = true;

        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.map((item, index) => {
                if (item.id === id) {
                    notFound = false;
                    return Object.assign({}, deepmerge(item, data));
                }
                return item;
            })
        });

        if (notFound) {
            this._dataStore = { collection: [...this._dataStore.collection, data] };
        }
    }

    protected _removeCollectionItem(id: any) {
        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.filter(item => item.id !== id)
        });
    }

    _dangerousGraphUpdateCollection(items: T[]) {
        // Exposed as a hook for the GraphService, need better solution for this...
        if (items.length) {
            items.forEach(i => this._updateCollectionItem(i.id, i));
            this._recordHistory('GRAPH-UPDATE');
        }
    }
}