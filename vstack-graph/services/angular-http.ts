import {RemotePersistenceMapper} from './remote.service';
import {Observable} from 'rxjs/Observable';
import {CollectionItem, clone, mergeCollection} from '../utilities';

export class AngularHttpMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
    protected _baseUrl: string;
    protected _requestOptionsArgs: any;
    private _http: any;

    constructor({ baseUrl, http, options } : { baseUrl: string, http: any, options?: {} }) {
        this._baseUrl = baseUrl;
        this._requestOptionsArgs = options;
        this._http = http;
    }
    
    create(items: TItem[]): Observable<TItem[]> {
        return this._http.post(`${this._baseUrl}/bulk`, JSON.stringify(items), Object.assign({}, this._requestOptionsArgs)).map(res => res.json());
    }
    
    update(items: TItem[]): Observable<TItem[]> {
         return this._http.put(`${this._baseUrl}/bulk`, JSON.stringify(items), Object.assign({}, this._requestOptionsArgs)).map(res => res.json());
    }
    
    delete(ids: any[]): Observable<any> {
        return this._http.delete(`${this._baseUrl}?ids=${ids.join()}`, Object.assign({}, this._requestOptionsArgs)).map(res => res.status);
    }
    
    load(id: string, options = '') {
        return this._http.get(`${this._baseUrl}/${id}`, Object.assign({}, this._requestOptionsArgs, options)).map(res => res.json());
    }
    
    loadMany(options = '') {
        return this._http.get(this._baseUrl, Object.assign({}, this._requestOptionsArgs, options)).map(res => res.json());
    }
}