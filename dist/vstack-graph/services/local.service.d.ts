import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { CollectionItem } from '../utilities';
export interface LocalPersistenceMapper<TItem extends CollectionItem> {
    create(items: TItem[]): Observable<TItem[]>;
    update(items: TItem[]): Observable<TItem[]>;
    delete(ids: any[]): Observable<any>;
}
export declare abstract class LocalCollectionService<TItem extends CollectionItem> {
    protected _mapper: LocalPersistenceMapper<TItem>;
    protected _collection: BehaviorSubject<TItem[]>;
    protected _errors: Subject<{}>;
    protected _history: Subject<{}>;
    protected dataStore: {
        collection: TItem[];
    };
    private historyStore;
    constructor(_mapper: LocalPersistenceMapper<TItem>);
    readonly collection: Observable<TItem[]>;
    readonly errors: Observable<any>;
    readonly history: Observable<{
        action: string;
        state: {
            collection: TItem[];
        };
    }[]>;
    create(item: any | TItem): Observable<TItem>;
    createMany(items: any[] | TItem[]): Observable<TItem[]>;
    update(item: any | TItem): Observable<TItem>;
    updateMany(items: any[] | TItem[]): Observable<TItem[]>;
    delete(id: any): Observable<any>;
    deleteMany(ids: any[]): Observable<any[]>;
    protected recordHistory(action: string): void;
    protected removeCollectionItems(ids: any[]): void;
    protected assignIds(items: any[]): void;
    private getGuid();
}
