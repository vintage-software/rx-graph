import { Observable } from 'rxjs/Observable';

import { CollectionItem, Id } from '../utilities';

import { LocalPersistenceMapper } from './local-persistence.mapper';

export interface RemotePersistenceMapper<TItem extends CollectionItem> extends LocalPersistenceMapper<TItem> {
  load(id: Id, options: string): Observable<TItem>;
  loadMany(options: string): Observable<TItem[]>;
}
