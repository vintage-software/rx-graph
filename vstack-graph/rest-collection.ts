import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/map';

import {slimify, CollectionItem, clone, mergeCollection} from './utilities';
import {IHttp, RequestOptionsArgs} from './interfaces/http';

export abstract class RestCollection<TItem extends CollectionItem> {
    protected _baseUrl: string;
    protected _requestOptionsArgs: any;
    private _http: IHttp;
    private _collection$: BehaviorSubject<TItem[]>;
    private _errors$: BehaviorSubject<any>;
    private _history$: BehaviorSubject<any>;
    private _dataStore: { collection: TItem[] };
    private _historyStore: any[];

    constructor({ baseUrl, http, options } : { baseUrl: string, http: IHttp, options?: RequestOptionsArgs | {} }) {
        this._collection$ = new BehaviorSubject(<TItem[]>[]);
        this._errors$ = new BehaviorSubject(<any>{});
        this._history$ = new BehaviorSubject(<any>{});

        this._baseUrl = baseUrl;
        this._requestOptionsArgs = options;
        this._http = http;
       
        this._dataStore = { collection: [] };
        this._historyStore = [];
        this._recordHistory('INIT');
    }

    get collection$(): Observable<TItem[]> {
        return this._collection$.map(collection => clone(collection));
    }

    get errors$(): Observable<any> {
        return this._errors$;
    }

    get history$(): Observable<any> {
        return this._history$;
    }

    loadAll(options = ''): Observable<Array<TItem>> {
        let completion$ = new ReplaySubject(1);

        this._apiGet(`${this._baseUrl}?${options}`).subscribe(data => {
            mergeCollection(this._dataStore.collection, data);
            this._recordHistory('LOAD_ALL');
            completion$.next(clone(data));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    load(id: any, options = ''): Observable<TItem> {
        let completion$ = new ReplaySubject(1);

        this._apiGet(`${this._baseUrl}/${id}?${options}`).subscribe(data => {
            mergeCollection(this._dataStore.collection, [data]);
            this._recordHistory('LOAD');
            completion$.next(clone(data));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    create(item: any, options: string = ''): Observable<TItem> {
        let completion$ = new ReplaySubject(1);

        this._apiPost(this._baseUrl, slimify(item)).subscribe(data => {
            mergeCollection(this._dataStore.collection, [data]);
            this._recordHistory('CREATE');
            completion$.next(clone(data));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    update(item: any): Observable<TItem> {
        let completion$ = new ReplaySubject(1);

        this._apiPut(`${this._baseUrl}/${item.id}`, slimify(item)).subscribe(data => {
            mergeCollection(this._dataStore.collection, [data]);
            this._recordHistory('UPDATE');
            completion$.next(clone(data));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    remove(id: any): Observable<TItem> {
        let completion$ = new ReplaySubject(1);

        this._apiDelete(`${this._baseUrl}/${id}`).subscribe(response => {
            this._removeCollectionItem(id);
            this._recordHistory('REMOVE');
            completion$.next(null);
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
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

    protected _removeCollectionItem(id: any) {
        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.filter(item => item.id !== id)
        });
    }

    _dangerousGraphUpdateCollection(items: TItem[]) {
        // Exposed as a hook for the GraphService, need better solution for this...
        if (items.length) {
            items.forEach(i => this._updateCollectionItem(i.id, i));
            this._recordHistory('GRAPH-UPDATE');
        }
    }
    
    protected _updateCollectionItem(id: any, data: any) {
        let notFound = true;

        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.map((item, index) => {
                if (item.id === id) {
                    notFound = false;
                    return Object.assign(item, data);
                }

                return item;
            })
        });

        if (notFound) {
            this._dataStore = { collection: [...this._dataStore.collection, data] };
        }
    }
}