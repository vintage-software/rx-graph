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
    private remotePersistenceMapper;
    constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>);
    readonly _remoteMapper: RemotePersistenceMapper<TItem>;
    protected inject(items: TItem[]): ReplaySubject<TItem>;
    protected load(id: any, options: string): ReplaySubject<TItem>;
    protected loadMany(isLoadAll: boolean, options: string): ReplaySubject<TItem[]>;
}
export declare abstract class CollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
    constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>);
    get(id: any, options?: string): Observable<TItem>;
    getAll(options?: string): Observable<TItem[]>;
}
export declare abstract class VSCollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
    constructor(remotePersistenceMapper: RemotePersistenceMapper<TItem>);
    get(id: any): VsQueryable<TItem>;
    getAll(): VsQueryable<TItem[]>;
}
