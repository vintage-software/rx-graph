import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CollectionItem, Id, QueryString } from '../utilities';

export interface LocalPersistenceMapper<TItem extends CollectionItem> {
  create(items: TItem[], options: QueryString): Observable<TItem[]>;
  update(items: TItem[], options: QueryString): Observable<TItem[]>;
  patch(items: TItem[], options: QueryString): Observable<TItem[]>;
  delete(ids: Id[], options: QueryString): Observable<any>;
}
