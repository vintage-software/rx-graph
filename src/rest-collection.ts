/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />

import {Http, RequestOptionsArgs} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/map';

import {deepmerge, slimify} from './utilities';

export interface Dto {
    id: any;
}

@Injectable()
export abstract class RestCollection<T extends Dto> {
    protected _requestOptionsArgs: RequestOptionsArgs;
    protected _collection$: BehaviorSubject<T[]>;
    private _errors$: BehaviorSubject<any>;
    private _store: { collection: T[] };
    private _history: any[];

    static debug = false;

    constructor(
        protected _baseUrl: string,
        private _http: Http) {
        this._collection$ = new BehaviorSubject(<T[]>[]);
        this._errors$ = new BehaviorSubject(<any>{});

        this._store = { collection: [] };
        this._history = [];
        this._recordHistory('INIT');
    }

    get collection$(): Observable<T[]> {
        return this._collection$; //.map(collection => this._clone(this._store.collection));
    }

    get errors$(): Observable<any> {
        return this._errors$;
    }

    loadAll(options = ''): Observable<Array<T>> {
        let completion$ = new Subject();

        this._apiGet(`${this._baseUrl}?${options}`).subscribe(data => {
            this._updateCollection(data);
            this._recordHistory('LOAD_ALL');
            this._collection$.next(this._store.collection);
            completion$.next(data);
            completion$.complete();
        }, error => {  this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    load(id: any, options = ''): Observable<T> {
        let completion$ = new Subject();

        this._apiGet(`${this._baseUrl}/${id}?${options}`).subscribe(data => {
            this._updateCollectionItem(data.id, data);
            this._recordHistory('LOAD');
            this._collection$.next(this._store.collection);
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
            this._collection$.next(this._store.collection);
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
            this._collection$.next(this._store.collection);
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
            this._collection$.next(this._store.collection);
            completion$.next(null);
            completion$.complete();
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    updateCollection(items: T[]) {
        if (items.length) {
            items.forEach(i => this._updateCollectionItem(i.id, i));
            this._recordHistory('MASTER-UPDATE');
        }
    }

    protected _apiGet(url: string, opt?) {
        let options = Object.assign({}, this._requestOptionsArgs, opt);
        return this._http.get(url, options)
            .map(res => res.json());
    }

    protected _apiPost(url: string, val, opt?) {
        let options = Object.assign({}, this._requestOptionsArgs, opt);
        let body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.post(url, body, options)
            .map(res => res.json());
    }

    protected _apiPut(url: string, val, opt?) {
        let options = Object.assign({}, this._requestOptionsArgs, opt);
        let body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.put(url, body, options)
            .map(res => res.json());
    }

    protected _apiDelete(url: string, opt?) {
        let options = Object.assign({}, this._requestOptionsArgs, opt);
        return this._http.delete(url, options)
            .map(res => res.status);
    }

    protected _recordHistory(action: string) {
        if (RestCollection.debug) {
            if (this._history.length >= 100) {
                this._history.shift();
            } else {
                this._history.push({ action, state: this._store, resource: this._baseUrl });
            }
            console.log(this._history.slice(-1)[0]);
        }
    }

    protected _updateCollection(collection: any[]) {
        this._store = Object.assign({}, this._store, { collection }); // need to add/merge not replace
    }

    protected _addCollectionItem(item: any) {
        this._store = { collection: [...this._store.collection, item] };
    }

    protected _updateCollectionItem(id: any, data: any) {
        let notFound = true;

        this._store = Object.assign({}, this._store, {
            collection: this._store.collection.map((item, index) => {
                if (item.id === id) {
                    notFound = false;
                    return Object.assign({}, deepmerge(item, data));
                }
                return item;
            })
        });

        if (notFound) {
            this._store = { collection: [...this._store.collection, data] };
        }
    }

    protected _removeCollectionItem(id: any) {
        this._store = Object.assign({}, this._store, {
            collection: this._store.collection.filter(item => item.id !== id)
        });
    }
}