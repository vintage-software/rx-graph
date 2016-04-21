/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />
import { Http, RequestOptionsArgs } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Dto } from './utilities';
export declare abstract class RestCollection<T extends Dto> {
    protected _baseUrl: string;
    private _http;
    protected _requestOptionsArgs: RequestOptionsArgs;
    private _collection$;
    private _errors$;
    private _history$;
    private _dataStore;
    private _historyStore;
    constructor(_baseUrl: string, _http: Http);
    collection$: Observable<T[]>;
    errors$: Observable<any>;
    history$: Observable<any>;
    loadAll(options?: string): Observable<Array<T>>;
    load(id: any, options?: string): Observable<T>;
    create(item: any, options?: string): Observable<T>;
    update(item: any): Observable<T>;
    remove(id: any): Observable<T>;
    protected _apiGet(url: string, opt?: any): Observable<any>;
    protected _apiPost(url: string, val: any, opt?: any): Observable<any>;
    protected _apiPut(url: string, val: any, opt?: any): Observable<any>;
    protected _apiDelete(url: string, opt?: any): Observable<number>;
    protected _recordHistory(action: string): void;
    protected _updateCollection(collection: any[]): void;
    protected _addCollectionItem(item: any): void;
    protected _updateCollectionItem(id: any, data: any): void;
    protected _removeCollectionItem(id: any): void;
    _dangerousGraphUpdateCollection(items: T[]): void;
}
