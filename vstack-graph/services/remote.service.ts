import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {LocalCollectionService, LocalPersistenceMapper} from './local.service';
import {CollectionItem, clone, mergeCollection} from '../utilities';
import {VsQueryable} from './vs-queryable';

export interface RemotePersistenceMapper<TItem extends CollectionItem> extends LocalPersistenceMapper<TItem> {
    load(id: any, options: string): Observable<TItem>;
    loadMany(options: string): Observable<TItem[]>;
}

export abstract class BaseRemoteService<TItem extends CollectionItem> extends LocalCollectionService<TItem> {
    constructor(private _remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
        super(_remotePersistenceMapper);
    }

    get _remoteMapper() {
        return <RemotePersistenceMapper<TItem>>this._mapper;
    }
    
    protected _assignIds(items: any[]) {
        
    }

    protected _load(id: any, options: string) {
        let completion$ = new ReplaySubject(1);

        this._remoteMapper.load(id, options).subscribe(item => {
            mergeCollection(this._dataStore.collection, [item]);
            this._recordHistory('LOAD');
            completion$.next(clone(item));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }

    protected _loadMany(isLoadAll: boolean, options: string) {
        let completion$ = new ReplaySubject(1);

        this._remoteMapper.loadMany(options).subscribe(items => {
            mergeCollection(this._dataStore.collection, items);
            if (isLoadAll) {
                this._dataStore.collection = this._dataStore.collection.filter(i => !!items.find(j => j.id === i.id));
            }
            this._recordHistory('LOAD_MANY');
            completion$.next(clone(items));
            completion$.complete();
            this._collection$.next(this._dataStore.collection);
        }, error => { this._errors$.next(error); completion$.error(error); });

        return completion$;
    }
}

export abstract class CollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
    constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
        super(_remotePersistenceMapper);
    }
    
    get(id: any, options?: string): Observable<TItem> {
        return this._load(id, options);
    }

    getAll(options?: string): Observable<TItem[]> {
        let isLoadAll = !!!options;
        return this._loadMany(isLoadAll, options);
    }
}

export abstract class VSCollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
    constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>) {
        super(_remotePersistenceMapper);
    }
    
    get(id: any): VsQueryable<TItem> {
        return new VsQueryable<TItem>(options => this._load(id, options));
    }

    getAll(): VsQueryable<TItem[]> {
        return new VsQueryable<TItem[]>((isLoadAll, options) => this._loadMany(isLoadAll, options));
    }
}