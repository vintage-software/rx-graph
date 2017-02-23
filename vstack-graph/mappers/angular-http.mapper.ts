import { RemotePersistenceMapper } from './remote-persistence.mapper';
import { Observable } from 'rxjs/Observable';

import { CollectionItem, Id } from '../utilities';
import { AngularHttp, AngularRequestOptionsArgs } from './angular-http';

export class AngularHttpMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
  protected baseUrl: string;
  protected requestOptionsArgs: AngularRequestOptionsArgs;
  private http: AngularHttp;

  constructor({ baseUrl, http, options }: { baseUrl: string, http: AngularHttp, options?: AngularRequestOptionsArgs }) {
    this.baseUrl = baseUrl;
    this.requestOptionsArgs = options;
    this.http = http;
  }

  create(items: TItem[], options = ''): Observable<TItem[]> {
    return this.http.post(`${this.baseUrl}/bulk?${options}`, JSON.stringify(items), this.requestOptionsArgs).map(res => res.json());
  }

  update(items: TItem[], options = ''): Observable<TItem[]> {
    return this.http.put(`${this.baseUrl}/bulk?${options}`, JSON.stringify(items), this.requestOptionsArgs).map(res => res.json());
  }

  patch(items: TItem[], options = ''): Observable<TItem[]> {
    return this.http.patch(`${this.baseUrl}/bulk?${options}`, JSON.stringify(items), this.requestOptionsArgs).map(res => res.json());
  }

  delete(ids: Id[], options = ''): Observable<any> {
    return this.http.delete(`${this.baseUrl}?ids=${ids.join()}&${options}`, this.requestOptionsArgs).map(res => res.status);
  }

  load(id: Id, options = '') {
    return this.http.get(`${this.baseUrl}/${id}?${options}`, this.requestOptionsArgs).map(res => res.json());
  }

  loadMany(options = '') {
    return this.http.get(`${this.baseUrl}?${options}`, this.requestOptionsArgs).map(res => res.json());
  }
}
