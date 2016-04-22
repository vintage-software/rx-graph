/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CollectionItem, IHttp } from './utilities';
export declare abstract class RestCollection<TItem extends CollectionItem, TOptions> {
    protected _baseUrl: string;
    protected _requestOptionsArgs: any;
    private _http;
    private _collection$;
    private _errors$;
    private _history$;
    private _dataStore;
    private _historyStore;
    constructor({baseUrl, http, options}: {
        baseUrl: string;
        http: IHttp<TOptions>;
        options?: TOptions;
    });
    collection$: Observable<TItem[]>;
    errors$: Observable<any>;
    history$: Observable<any>;
    loadAll(options?: string): Observable<Array<TItem>>;
    load(id: any, options?: string): Observable<TItem>;
    create(item: any, options?: string): Observable<TItem>;
    update(item: any): Observable<TItem>;
    remove(id: any): Observable<TItem>;
    protected _apiGet(url: string, opt?: any): Observable<any>;
    protected _apiPost(url: string, val: any, opt?: any): Observable<any>;
    protected _apiPut(url: string, val: any, opt?: any): Observable<any>;
    protected _apiDelete(url: string, opt?: any): Observable<any>;
    protected _recordHistory(action: string): void;
    protected _removeCollectionItem(id: any): void;
    _dangerousGraphUpdateCollection(items: TItem[]): void;
    protected _updateCollectionItem(id: any, data: any): void;
}
