import { Observable } from 'rxjs/Observable';

import { CollectionItem, Id } from '../utilities';

import { RemotePersistenceMapper } from '../mappers/remote-persistence.mapper';
import { RemoteCollectionService } from './remote-collection.service';

export abstract class CollectionService<TItem extends CollectionItem> extends RemoteCollectionService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: Id, options?: string): Observable<TItem[]> {
    return this.load(id, options);
  }

  getAll(options?: string): Observable<TItem[]> {
    let isLoadAll = !!!options;
    return this.loadMany(isLoadAll, options);
  }
}
