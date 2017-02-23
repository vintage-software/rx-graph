import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CollectionItem, Id } from '../utilities';

export interface LocalPersistenceMapper<TItem extends CollectionItem> {
  create(items: TItem[], options: string): Observable<TItem[]>;
  update(items: TItem[], options: string): Observable<TItem[]>;
  patch(items: TItem[], options: string): Observable<TItem[]>;
  delete(ids: Id[], options: string): Observable<any>;
}
