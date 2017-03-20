import { Observable } from 'rxjs/Observable';

import { parseExplicitTypes, CollectionItem, Id, QueryString } from '../utilities';
import { AngularHttp, AngularRequestOptionsArgs, AngularResponse } from './angular-http';

import { AngularHttpMapper } from './angular-http.mapper';

export class VsAngularHttpMapper<TItem extends CollectionItem> extends AngularHttpMapper<TItem> {
  constructor({ baseUrl, http, options }: { baseUrl: string, http: AngularHttp, options?: AngularRequestOptionsArgs }) {
    super({ baseUrl, http, options });
  }

  create(items: TItem[], options: QueryString): Observable<TItem[]> {
    return this.wrapRequest(options, explicitOptions => this.createInternal(items, explicitOptions));
  }

  update(items: TItem[], options: QueryString): Observable<TItem[]> {
    return this.wrapRequest(options, explicitOptions => this.updateInternal(items, explicitOptions));
  }

  patch(items: TItem[], options: QueryString): Observable<TItem[]> {
    return this.wrapRequest(options, explicitOptions => this.patchInternal(items, explicitOptions));
  }

  load(id: Id, options: QueryString): Observable<TItem> {
    return this.wrapRequest(options, explicitOptions => this.loadInternal(id, explicitOptions));
  }

  loadMany(options: QueryString): Observable<TItem[]> {
    return this.wrapRequest(options, explicitOptions => this.loadManyInternal(explicitOptions));
  }

  private wrapRequest(options: QueryString, request: (options: QueryString) => Observable<AngularResponse>) {
    const explicitOptions = Object.assign({}, options, { explicitTypes: 'DateTime' });

    return request(explicitOptions)
      .map(res => res.text())
      .map(json => JSON.parse(json, parseExplicitTypes));
  }
}
