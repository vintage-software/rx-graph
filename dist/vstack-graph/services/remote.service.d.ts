import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LocalCollectionService, LocalPersistenceMapper } from './local.service';
import { CollectionItem } from '../utilities';
import { VsQueryable } from './vs-queryable';
export interface RemotePersistenceMapper<TItem extends CollectionItem> extends LocalPersistenceMapper<TItem> {
    load(id: any, options: string): Observable<TItem>;
    loadMany(options: string): Observable<TItem[]>;
}
export declare abstract class BaseRemoteService<TItem extends CollectionItem> extends LocalCollectionService<TItem> {
    private _remotePersistenceMapper;
    constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>);
    _remoteMapper: RemotePersistenceMapper<TItem>;
    protected _assignIds(items: any[]): void;
    protected _load(id: any, options: string): ReplaySubject<TItem>;
    protected _loadMany(isLoadAll: boolean, options: string): ReplaySubject<TItem[]>;
}
export declare abstract class CollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
    constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>);
    get(id: any, options?: string): Observable<TItem>;
    getAll(options?: string): Observable<TItem[]>;
}
export declare abstract class VSCollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
    constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>);
    get(id: any): VsQueryable<TItem>;
    getAll(): VsQueryable<TItem[]>;
}
