/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />
import { Http, RequestOptionsArgs } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
export interface Dto {
    id: any;
}
export declare abstract class RestCollection<T extends Dto> {
    protected _baseUrl: string;
    private _http;
    protected _requestOptionsArgs: RequestOptionsArgs;
    protected _collection$: BehaviorSubject<T[]>;
    private _errors$;
    private _store;
    private _history;
    static debug: boolean;
    constructor(_baseUrl: string, _http: Http);
    collection$: Observable<T[]>;
    errors$: Observable<T[]>;
    loadAll(options?: string): Observable<Array<T>>;
    load(id: any, options?: string): Observable<T>;
    create(item: any, options?: string): Observable<T>;
    update(item: any): Observable<T>;
    remove(id: any): Observable<T>;
    updateCollection(items: T[]): void;
    protected _apiGet(url: string, opt?: any): Observable<any>;
    protected _apiPost(url: string, val: any, opt?: any): Observable<any>;
    protected _apiPut(url: string, val: any, opt?: any): Observable<any>;
    protected _apiDelete(url: string, opt?: any): Observable<number>;
    protected _recordHistory(action: string): void;
    protected _replaceCollection(collection: any[]): void;
    protected _addCollectionItem(item: any): void;
    protected _updateCollectionItem(id: any, data: any): void;
    protected _removeCollectionItem(id: any): void;
    private _clone(obj);
    private _slimify(item);
    private _isPrimitive(item);
}
