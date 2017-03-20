import { RemotePersistenceMapper } from './remote-persistence.mapper';
import { Observable } from 'rxjs/Observable';

import { toQueryString, CollectionItem, Id, QueryString } from '../utilities';
import { AngularHttp, AngularRequestOptionsArgs, AngularResponse } from './angular-http';

export class AngularHttpMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
  protected baseUrl: string;
  protected requestOptionsArgs: AngularRequestOptionsArgs;
  private http: AngularHttp;

  constructor({ baseUrl, http, options }: { baseUrl: string, http: AngularHttp, options?: AngularRequestOptionsArgs }) {
    this.baseUrl = baseUrl;
    this.requestOptionsArgs = options;
    this.http = http;
  }

  create(items: TItem[], options: QueryString): Observable<TItem[]> {
    return this.createInternal(items, options).map(res => res.json());
  }

  update(items: TItem[], options: QueryString): Observable<TItem[]> {
    return this.updateInternal(items, options).map(res => res.json());
  }

  patch(items: TItem[], options: QueryString): Observable<TItem[]> {
    return this.patchInternal(items, options).map(res => res.json());
  }

  delete(ids: Id[], options: QueryString): Observable<any> {
    return this.deleteInternal(ids, options).map(res => res.status);
  }

  load(id: Id, options: QueryString): Observable<TItem> {
    return this.loadInternal(id, options).map(res => res.json());
  }

  loadMany(options: QueryString): Observable<TItem[]> {
    return this.loadManyInternal(options).map(res => res.json());
  }

  protected createInternal(items: TItem[], options: QueryString): Observable<AngularResponse> {
    let queryString = toQueryString(options);
    return this.http.post(`${this.baseUrl}/bulk?${queryString}`, JSON.stringify(items), this.requestOptionsArgs);
  }

  protected updateInternal(items: TItem[], options: QueryString): Observable<AngularResponse> {
    let queryString = toQueryString(options);
    return this.http.put(`${this.baseUrl}/bulk?${queryString}`, JSON.stringify(items), this.requestOptionsArgs);
  }

  protected patchInternal(items: TItem[], options: QueryString): Observable<AngularResponse> {
    let queryString = toQueryString(options);
    return this.http.patch(`${this.baseUrl}/bulk?${queryString}`, JSON.stringify(items), this.requestOptionsArgs);
  }

  protected deleteInternal(ids: Id[], options: QueryString): Observable<AngularResponse> {
    let optionsWithIds: QueryString = Object.assign({}, options, { ids: ids.join() });
    let queryString = toQueryString(optionsWithIds);
    return this.http.delete(`${this.baseUrl}?&${queryString}`, this.requestOptionsArgs);
  }

  protected loadInternal(id: Id, options: QueryString): Observable<AngularResponse> {
    let queryString = toQueryString(options);
    return this.http.get(`${this.baseUrl}/${id}?${queryString}`, this.requestOptionsArgs);
  }

  protected loadManyInternal(options: QueryString): Observable<AngularResponse> {
    let queryString = toQueryString(options);
    return this.http.get(`${this.baseUrl}?${queryString}`, this.requestOptionsArgs);
  }
}
