import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LocalCollectionService, LocalPersistenceMapper } from './local.service';
import { CollectionItem, clone, mergeCollection } from '../utilities';
import { VsQueryable } from './vs-queryable';

export interface RemotePersistenceMapper<TItem extends CollectionItem> extends LocalPersistenceMapper<TItem> {
  load(id: any, options: string): Observable<TItem>;
  loadMany(options: string): Observable<TItem[]>;
}

export abstract class BaseRemoteService<TItem extends CollectionItem> extends LocalCollectionService<TItem> {
  constructor(private remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get _remoteMapper() {
    return <RemotePersistenceMapper<TItem>>this._mapper;
  }

  protected load(id: any, options: string) {
    let completion$ = new ReplaySubject<TItem>(1);

    this._remoteMapper.load(id, options).subscribe(item => {
      mergeCollection(this.dataStore.collection, [item]);
      this.recordHistory('LOAD');
      completion$.next(clone(item));
      completion$.complete();
      this._collection$.next(this.dataStore.collection);
    }, error => { this._errors$.next(error); completion$.error(error); });

    return completion$;
  }

  protected loadMany(isLoadAll: boolean, options: string) {
    let completion$ = new ReplaySubject<TItem[]>(1);

    this._remoteMapper.loadMany(options).subscribe(items => {
      mergeCollection(this.dataStore.collection, items);
      if (isLoadAll) {
        this.dataStore.collection = this.dataStore.collection.filter(i => !!items.find(j => j.id === i.id));
      }

      this.recordHistory('LOAD_MANY');
      completion$.next(clone(items));
      completion$.complete();
      this._collection$.next(this.dataStore.collection);
    }, error => { this._errors$.next(error); completion$.error(error); });

    return completion$;
  }
}

export abstract class CollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: any, options?: string): Observable<TItem> {
    return this.load(id, options);
  }

  getAll(options?: string): Observable<TItem[]> {
    let isLoadAll = !!!options;
    return this.loadMany(isLoadAll, options);
  }
}

export abstract class VSCollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
  constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
    super(remotePersistenceMapper);
  }

  get(id: any): VsQueryable<TItem> {
    return new VsQueryable<TItem>((isLoadAll, options) => this.load(id, options));
  }

  getAll(): VsQueryable<TItem[]> {
    return new VsQueryable<TItem[]>((isLoadAll, options) => this.loadMany(isLoadAll, options));
  }
}