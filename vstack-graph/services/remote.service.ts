import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { LocalCollectionService, LocalPersistenceMapper } from './local.service';
import { CollectionItem, deepClone, mergeCollection } from '../utilities';

export interface RemotePersistenceMapper<TItem extends CollectionItem> extends LocalPersistenceMapper<TItem> {
  load(id: any, options: string): Observable<TItem>;
  loadMany(options: string): Observable<TItem[]>;
}

export abstract class BaseRemoteService<TItem extends CollectionItem> extends LocalCollectionService<TItem> {
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

  protected load(id: any, options: string) {
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
