import { CollectionItem } from '../utilities';
import { VsElasticQueryable } from './vs-elastic-queryable';

import { BaseRemoteService, RemotePersistenceMapper } from './remote.service';

export abstract class VsElasticCollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: any): VsElasticQueryable<TItem> {
    return new VsElasticQueryable<TItem>((_isLoadAll, options) => this.load(id, options));
  }

  getAll(): VsElasticQueryable<TItem> {
    return new VsElasticQueryable<TItem>((isLoadAll, options) => this.loadMany(isLoadAll, options));
  }
}
