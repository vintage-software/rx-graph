import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { slimify, CollectionItem, clone, mergeCollection } from '../utilities';

export interface LocalPersistenceMapper<TItem extends CollectionItem> {
  create(items: TItem[], options: string): Observable<TItem[]>;
  update(items: TItem[], options: string): Observable<TItem[]>;
  delete(ids: any[], options: string): Observable<any>;
}

export abstract class LocalCollectionService<TItem extends CollectionItem> {
  protected _collection = new BehaviorSubject(<TItem[]>[]);
  protected _errors = new Subject();
  protected _history = new Subject();
  protected dataStore: { collection: TItem[] };
  private historyStore: { action: string, state: { collection: TItem[] }}[]; // inline interface for generic support

  constructor(protected _mapper: LocalPersistenceMapper<TItem>) {
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

  create(item: any | TItem, options = ''): Observable<TItem> {
    return this.createMany([item], options).map(items => items.find(i => true));
  }

  createMany(items: TItem[], options = ''): Observable<TItem[]> {
    let completion = new ReplaySubject<TItem[]>(1);
    this.assignIds(items);

    this._mapper.create(items.map(i => slimify(i)), options).subscribe(items => {
      mergeCollection(this.dataStore.collection, items);
      this.recordHistory('CREATE');
      completion.next(clone(items));
      completion.complete();
      this._collection.next(this.dataStore.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  update(item: any | TItem, options = ''): Observable<TItem> {
    return this.updateMany([item], options).map(items => items.find(i => true));
  }

  updateMany(items: TItem[], options = ''): Observable<TItem[]> {
    let completion = new ReplaySubject<TItem[]>(1);

    this._mapper.update(items.map(i => slimify(i)), options).subscribe(items => {
      mergeCollection(this.dataStore.collection, items);
      this.recordHistory('UPDATE');
      completion.next(clone(items));
      completion.complete();
      this._collection.next(this.dataStore.collection);
    }, error => { this._errors.next(error); completion.error(error); });

    return completion;
  }

  delete(id: any, options = ''): Observable<any> {
    return this.deleteMany([id], options).map(items => items.find(i => true));
  }

  deleteMany(ids: any[], options = ''): Observable<any[]> {
    let completion = new ReplaySubject<TItem[]>(1);

    this._mapper.delete(ids, options).subscribe(() => {
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
    return `${this.s4()}${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}${this.s4()}${this.s4()}`;
  }

  private s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
