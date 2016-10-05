import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { CollectionItem } from '../utilities';
export interface LocalPersistenceMapper<TItem extends CollectionItem> {
    create(items: TItem[], options: string): Observable<TItem[]>;
    update(items: TItem[], options: string): Observable<TItem[]>;
    delete(ids: any[], options: string): Observable<any>;
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
    create(item: any | TItem, options?: string): Observable<TItem>;
    createMany(items: TItem[], options?: string): Observable<TItem[]>;
    update(item: any | TItem, options?: string): Observable<TItem>;
    updateMany(items: TItem[], options?: string): Observable<TItem[]>;
    delete(id: any, options?: string): Observable<any>;
    deleteMany(ids: any[], options?: string): Observable<any[]>;
    protected recordHistory(action: string): void;
    protected removeCollectionItems(ids: any[]): void;
    protected assignIds(items: any[]): void;
    private getGuid();
    private s4();
}
