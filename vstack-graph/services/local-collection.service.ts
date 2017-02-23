import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { slimify, CollectionItem, deepClone, mergeCollection, Id } from '../utilities';

import { LocalPersistenceMapper } from '../mappers/local-persistence.mapper';

export abstract class LocalCollectionService<TItem extends CollectionItem> {
  protected _collection = new BehaviorSubject(<TItem[]>[]);
  protected _errors = new Subject();
  protected _history = new Subject();
  protected store: { collection: TItem[] };
  private historyStore: { action: string, state: { collection: TItem[] }}[];

  constructor(protected _mapper: LocalPersistenceMapper<TItem>) {
    this.store = { collection: [] };
    this.historyStore = [];
    this.recordHistory('INIT');
  }

  get collection(): Observable<TItem[]> {
    return this._collection.map(collection => deepClone(collection));
  }

  get errors(): Observable<any> {
    return this._errors.asObservable();
  }

  get history(): Observable<{ action: string, state: { collection: TItem[] }}[]> {
    return this._history.asObservable();
  }

  create(item: any | TItem, options = ''): Observable<TItem> {
    return this.createMany([item], options).map(items => items.find(() => true));
  }

  createMany(items: TItem[], options = ''): Observable<TItem[]> {
    let completion = new ReplaySubject<TItem[]>(1);
    this.assignIds(items);

    this._mapper.create(items.map(i => slimify(i)), options).subscribe(items => {
      mergeCollection(this.store.collection, items);
      this.recordHistory('CREATE');
      completion.next(deepClone(items));
      completion.complete();
      this._collection.next(this.store.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  update(item: any | TItem, options = ''): Observable<TItem> {
    return this.updateMany([item], options).map(items => items.find(() => true));
  }

  updateMany(items: TItem[], options = ''): Observable<TItem[]> {
    let completion = new ReplaySubject<TItem[]>(1);

    this._mapper.update(items.map(i => slimify(i)), options).subscribe(items => {
      mergeCollection(this.store.collection, items);
      this.recordHistory('UPDATE');
      completion.next(deepClone(items));
      completion.complete();
      this._collection.next(this.store.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  patch(item: any | TItem, options = ''): Observable<TItem> {
    return this.patchMany([item], options).map(items => items.find(() => true));
  }

  patchMany(items: TItem[], options = ''): Observable<TItem[]> {
    let completion = new ReplaySubject<TItem[]>(1);

    this._mapper.patch(items.map(i => slimify(i)), options).subscribe(items => {
      mergeCollection(this.store.collection, items);
      this.recordHistory('PATCH');
      completion.next(deepClone(items));
      completion.complete();
      this._collection.next(this.store.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  delete(id: Id, options = ''): Observable<any> {
    return this.deleteMany([id], options).map(items => items.find(() => true));
  }

  deleteMany(ids: Id[], options = ''): Observable<Id[]> {
    let completion = new ReplaySubject<Id[]>(1);

    this._mapper.delete(ids, options).subscribe(() => {
      this.removeCollectionItems(ids);
      this.recordHistory('DELETE');
      completion.next(ids);
      completion.complete();
      this._collection.next(this.store.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  protected recordHistory(action: string) {
    if (this.historyStore.length >= 100) {
      this.historyStore.shift();
    }

    this.historyStore.push({ action, state: this.store });
    this._history.next(this.historyStore);
  }

  protected removeCollectionItems(ids: Id[]) {
    this.store = Object.assign({}, this.store, {
      collection: this.store.collection.filter(item => !ids.find(id => id === item.id))
    });
  }

  protected assignIds(items: CollectionItem[]) {
    items.forEach(i => i.id = this.getGuid());
  }

  private getGuid() {
    return `${this.s4()}${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}${this.s4()}${this.s4()}`;
  }

  private s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
