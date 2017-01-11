import { Observable } from 'rxjs/Observable';

import { CollectionItem } from '../utilities';

import { BaseRemoteService, RemotePersistenceMapper } from './remote.service';

export abstract class CollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: any, options?: string): Observable<TItem[]> {
    return this.load(id, options);
  }

  getAll(options?: string): Observable<TItem[]> {
    let isLoadAll = !!!options;
    return this.loadMany(isLoadAll, options);
  }
}
