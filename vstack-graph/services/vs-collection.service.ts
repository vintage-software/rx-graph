import { CollectionItem, Id } from '../utilities';
import { VsQueryable } from './vs-queryable';

import { RemotePersistenceMapper } from '../mappers/remote-persistence.mapper';
import { RemoteCollectionService } from './remote-collection.service';

export abstract class VsCollectionService<TItem extends CollectionItem> extends RemoteCollectionService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: Id): VsQueryable<TItem> {
    return new VsQueryable<TItem>((_isLoadAll, options) => this.load(id, options));
  }

  getAll(): VsQueryable<TItem> {
    return new VsQueryable<TItem>((isLoadAll, options) => this.loadMany(isLoadAll, options));
  }
}
