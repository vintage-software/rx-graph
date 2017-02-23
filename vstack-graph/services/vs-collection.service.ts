import { CollectionItem, Id, QueryString } from '../utilities';
import { VsQueryable } from './vs-queryable';

import { RemotePersistenceMapper } from '../mappers/remote-persistence.mapper';
import { RemoteCollectionService } from './remote-collection.service';

export abstract class VsCollectionService<TItem extends CollectionItem> extends RemoteCollectionService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: Id): VsQueryable<TItem> {
    return new VsQueryable<TItem>((_isLoadAll: boolean, options: QueryString) => this.load(id, options));
  }

  getAll(): VsQueryable<TItem> {
    return new VsQueryable<TItem>((isLoadAll: boolean, options: QueryString) => this.loadMany(isLoadAll, options));
  }
}
