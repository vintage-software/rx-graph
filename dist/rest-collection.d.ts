import { Http, RequestOptionsArgs } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
export interface Dto {
    id: any;
}
export declare abstract class RestCollection<T extends Dto> {
    protected _baseUrl: string;
    private _http;
    protected _requestOptionsArgs: RequestOptionsArgs;
    private _collection$;
    private _errors$;
    private _store;
    private _history;
    static debug: boolean;
    constructor(_baseUrl: string, _http: Http);
    collection$: Observable<T[]>;
    errors$: Observable<T[]>;
    loadAll(options?: string): Observable<any>;
    load(id: any, options?: string): Observable<any>;
    create(item: any): Observable<any>;
    update(item: any): Observable<any>;
    remove(id: any): Observable<any>;
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
