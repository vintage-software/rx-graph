import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { slimify, CollectionItem, clone, mergeCollection } from '../utilities';

export interface LocalPersistenceMapper<TItem extends CollectionItem> {
  create(items: TItem[]): Observable<TItem[]>;
  update(items: TItem[]): Observable<TItem[]>;
  delete(ids: any[]): Observable<any>;
}

export abstract class LocalCollectionService<TItem extends CollectionItem> {
  protected _collection: BehaviorSubject<TItem[]>;
  protected _errors: BehaviorSubject<any>;
  protected _history: BehaviorSubject<any>;
  protected dataStore: { collection: TItem[] };
  private historyStore: { action: string, state: { collection: TItem[] }}[]; // inline interface for generic support

  constructor(protected _mapper: LocalPersistenceMapper<TItem>) {
    this._collection = new BehaviorSubject(<TItem[]>[]);
    this._errors = new BehaviorSubject(<any>{});
    this._history = new BehaviorSubject(<any>{});

    this.dataStore = { collection: [] };
    this.historyStore = [];
    this.recordHistory('INIT');
  }

  get collection(): Observable<TItem[]> {
    return this._collection.map(collection => clone(collection));
  }

  get errors(): Observable<any> {
    return this._errors.asObservable();
  }

  get history(): Observable<{ action: string, state: { collection: TItem[] }}[]> {
    return this._history.asObservable();
  }

  create(item: any | TItem): Observable<TItem> {
    return this.createMany([item])
      .map(items => items.find(i => true));
  }

  createMany(items: any[] | TItem[]): Observable<TItem[]> {
    let completion = new ReplaySubject<TItem[]>(1);
    this.assignIds(items);

    this._mapper.create(items.map(i => slimify(i))).subscribe(items => {
      mergeCollection(this.dataStore.collection, items);
      this.recordHistory('CREATE');
      completion.next(clone(items));
      completion.complete();
      this._collection.next(this.dataStore.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  update(item: any | TItem): Observable<TItem> {
    return this.updateMany([item])
      .map(items => items.find(i => true));
  }

  updateMany(items: any[] | TItem[]): Observable<TItem[]> {
    let completion = new ReplaySubject<TItem[]>(1);

    this._mapper.update(items.map(i => slimify(i))).subscribe(items => {
      mergeCollection(this.dataStore.collection, items);
      this.recordHistory('UPDATE');
      completion.next(clone(items));
      completion.complete();
      this._collection.next(this.dataStore.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  delete(id: any): Observable<any> {
    return this.deleteMany([id])
      .map(items => items.find(i => true));
  }

  deleteMany(ids: any[]): Observable<any[]> {
    let completion = new ReplaySubject<TItem[]>(1);

    this._mapper.delete(ids).subscribe(ids => {
      this.removeCollectionItems(ids);
      this.recordHistory('DELETE');
      completion.next(ids);
      completion.complete();
      this._collection.next(this.dataStore.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  protected recordHistory(action: string) {
    if (this.historyStore.length >= 100) {
      this.historyStore.shift();
    }
    this.historyStore.push({ action, state: this.dataStore });
    this._history.next(this.historyStore);
  }

  protected removeCollectionItems(ids: any[]) {
    this.dataStore = Object.assign({}, this.dataStore, {
      collection: this.dataStore.collection.filter(item => !ids.find(id => id === item.id))
    });
  }

  protected assignIds(items: any[]) {
    items.forEach(i => i.id = this.getGuid());
  }

  private getGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}
