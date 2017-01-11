import { CollectionItem } from '../utilities';
import { VsQueryable } from './vs-queryable';

import { BaseRemoteService, RemotePersistenceMapper } from './remote.service';

export abstract class VsCollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: any): VsQueryable<TItem> {
    return new VsQueryable<TItem>((_isLoadAll, options) => this.load(id, options));
  }

  getAll(): VsQueryable<TItem> {
    return new VsQueryable<TItem>((isLoadAll, options) => this.loadMany(isLoadAll, options));
  }
}
