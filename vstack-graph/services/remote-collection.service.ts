import { ReplaySubject } from 'rxjs/ReplaySubject';

import { LocalCollectionService } from './local-collection.service';
import { RemotePersistenceMapper } from '../mappers/remote-persistence.mapper';
import { CollectionItem, deepClone, mergeCollection, Id } from '../utilities';

export abstract class RemoteCollectionService<TItem extends CollectionItem> extends LocalCollectionService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get _remoteMapper() {
    return <RemotePersistenceMapper<TItem>>this._mapper;
  }

  protected inject(items: TItem[]) {
    let completion = new ReplaySubject<TItem[]>(1);

    mergeCollection(this.store.collection, items);
    this.recordHistory('INJECT');
    completion.next(deepClone(items));
    completion.complete();
    this._collection.next(this.store.collection);

    return completion;
  }

  protected load(id: Id, options: string) {
    let completion = new ReplaySubject<TItem[]>(1);

    this._remoteMapper.load(id, options).subscribe(item => {
      mergeCollection(this.store.collection, [item]);
      this.recordHistory('LOAD');
      completion.next([deepClone(item)]);
      completion.complete();
      this._collection.next(this.store.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  protected loadMany(isLoadAll: boolean, options: string) {
    let completion = new ReplaySubject<TItem[]>(1);

    this._remoteMapper.loadMany(options).subscribe(items => {
      mergeCollection(this.store.collection, items);
      if (isLoadAll) {
        this.store.collection = this.store.collection.filter(i => !!items.find(j => j.id === i.id));
      }

      this.recordHistory('LOAD_MANY');
      completion.next(deepClone(items));
      completion.complete();
      this._collection.next(this.store.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }
}
