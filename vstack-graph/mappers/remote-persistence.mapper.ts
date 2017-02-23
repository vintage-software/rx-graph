import { Observable } from 'rxjs/Observable';

import { CollectionItem, Id, QueryString } from '../utilities';

import { LocalPersistenceMapper } from './local-persistence.mapper';

export interface RemotePersistenceMapper<TItem extends CollectionItem> extends LocalPersistenceMapper<TItem> {
  load(id: Id, options: QueryString): Observable<TItem>;
  loadMany(options: QueryString): Observable<TItem[]>;
}
