import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/map';

import {slimify, CollectionItem, clone, mergeCollection} from '../utilities';

export interface LocalPersistenceMapper<TItem extends CollectionItem> {
    create(items: TItem[]): Observable<TItem[]>;
    update(items: TItem[]): Observable<TItem[]>;
    delete(ids: any[]): Observable<any>;
}

export abstract class LocalCollectionService<TItem extends CollectionItem> {
    protected _collection$: BehaviorSubject<TItem[]>;
    protected _errors$: BehaviorSubject<any>;
    protected _history$: BehaviorSubject<any>;
    protected _dataStore: { collection: TItem[] };
    private _historyStore: any[];

    constructor(protected _mapper: LocalPersistenceMapper<TItem>) {
        this._collection$ = new BehaviorSubject(<TItem[]>[]);
        this._errors$ = new BehaviorSubject(<any>{});
        this._history$ = new BehaviorSubject(<any>{});

        this._dataStore = { collection: [] };
        this._historyStore = [];
        this._recordHistory('INIT');
    }

    get collection$(): Observable<TItem[]> {
        return this._collection$.map(collection => clone(collection));
    }

    get errors$(): Observable<any> {
        return this._errors$;
    }

    get history$(): Observable<any> {
        return this._history$;
    }

    create(item: any | TItem): Observable<TItem> {
        return this.createMany([item])
            .map(items => items.find(i => true));
    }

    createMany(items: any[] | TItem[]): Observable<TItem[]> {
        let completion$ = new ReplaySubject(1);
        this._assignIds(items);

        this._mapper.create(items.map(i => slimify(i))).subscribe(items => {
            mergeCollection(this._dataStore.collection, items);
            this._recordHistory('CREATE');
            completion$.next(clone(items));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    update(item: any | TItem): Observable<TItem> {
        return this.updateMany([item])
            .map(items => items.find(i => true));
    }

    updateMany(items: any[] | TItem[]): Observable<TItem[]> {
        let completion$ = new ReplaySubject(1);

        this._mapper.update(items.map(i => slimify(i))).subscribe(items => {
            mergeCollection(this._dataStore.collection, items);
            this._recordHistory('UPDATE');
            completion$.next(clone(items));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    delete(id: any): Observable<any> {
        return this.deleteMany([id])
            .map(items => items.find(i => true));
    }

    deleteMany(ids: any[]): Observable<any[]> {
        let completion$ = new ReplaySubject(1);

        this._mapper.delete(ids).subscribe(ids => {
            this._removeCollectionItems(ids);
            this._recordHistory('DELETE');
            completion$.next(ids);
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    protected _recordHistory(action: string) {
        if (this._historyStore.length >= 100) {
            this._historyStore.shift();
        }
        this._historyStore.push({ action, state: this._dataStore });
        this._history$.next(this._historyStore);
    }

    protected _removeCollectionItems(ids: any[]) {
        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.filter(item => !ids.find(id => id === item.id))
        });
    }

    protected _assignIds(items: any[]) {
        items.forEach(i => i.id = this._getGuid());
    }

    private _getGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}