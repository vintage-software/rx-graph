import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { CollectionItem } from '../utilities';
export interface LocalPersistenceMapper<TItem extends CollectionItem> {
    create(items: TItem[]): Observable<TItem[]>;
    update(items: TItem[]): Observable<TItem[]>;
    delete(ids: any[]): Observable<any>;
}
export declare abstract class LocalCollectionService<TItem extends CollectionItem> {
    protected _mapper: LocalPersistenceMapper<TItem>;
    protected _collection$: BehaviorSubject<TItem[]>;
    protected _errors$: BehaviorSubject<any>;
    protected _history$: BehaviorSubject<any>;
    protected _dataStore: {
        collection: TItem[];
    };
    private _historyStore;
    constructor(_mapper: LocalPersistenceMapper<TItem>);
    collection$: Observable<TItem[]>;
    errors$: Observable<any>;
    history$: Observable<any>;
    create(item: any | TItem): Observable<TItem>;
    createMany(items: any[] | TItem[]): Observable<TItem[]>;
    update(item: any | TItem): Observable<TItem>;
    updateMany(items: any[] | TItem[]): Observable<TItem[]>;
    delete(id: any): Observable<any>;
    deleteMany(ids: any[]): Observable<any[]>;
    protected _recordHistory(action: string): void;
    protected _removeCollectionItems(ids: any[]): void;
    protected _assignIds(items: any[]): void;
    private _getGuid();
}
