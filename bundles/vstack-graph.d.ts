declare module "vstack-graph/utilities" {
    export interface CollectionItem {
        id: any;
    }
    export function clone(obj: any): any;
    export function mergeCollection<TItem extends CollectionItem>(target: TItem[], src: TItem[]): void;
    export function slimify(item: any): any;
    export function isPrimitive(item: any): boolean;
}
declare module "vstack-graph/services/local.service" {
    import { Observable } from 'rxjs/Observable';
    import { BehaviorSubject } from 'rxjs/BehaviorSubject';
    import 'rxjs/add/operator/map';
    import { CollectionItem } from "vstack-graph/utilities";
    export interface LocalPersistenceMapper<TItem extends CollectionItem> {
        create(items: TItem[]): Observable<TItem[]>;
        update(items: TItem[]): Observable<TItem[]>;
        delete(ids: any[]): Observable<any>;
    }
    export abstract class LocalCollectionService<TItem extends CollectionItem> {
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
}
declare module "vstack-graph/graph/graph-utilities" {
    import { Observable } from 'rxjs/Observable';
    import { LocalCollectionService } from "vstack-graph/services/local.service";
    import { CollectionItem } from "vstack-graph/utilities";
    export interface IService {
        collection$: Observable<CollectionItem[]>;
        errors$: Observable<any>;
    }
    export interface IServiceConfig<TGraph> {
        service: IService;
        func: (graph: TGraph, collection: CollectionItem[]) => void;
        mappings: Relation[];
    }
    export class Relation {
        collectionProperty: string;
        to: IService;
        mappingId: string;
        many: boolean;
        constructor(collectionProperty: string, to: IService, mappingId: string, many: boolean);
    }
    export class ServiceConfig<TCollectionItem extends CollectionItem, TGraph> implements IServiceConfig<TGraph> {
        service: LocalCollectionService<TCollectionItem>;
        func: (graph: TGraph, collection: TCollectionItem[]) => void;
        mappings: Relation[];
        constructor(service: LocalCollectionService<TCollectionItem>, func: (graph: TGraph, collection: TCollectionItem[]) => void, mappings: Relation[]);
    }
}
declare module "vstack-graph/graph/base-graph.service" {
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/Rx';
    import { IServiceConfig } from "vstack-graph/graph/graph-utilities";
    export class BaseGraphService<TGraph> {
        private _serviceConfigs;
        private _debug;
        graph$: Observable<TGraph>;
        constructor(_serviceConfigs: IServiceConfig<TGraph>[]);
        private _slimify(master);
        private _toGraph(master);
    }
}
declare module "vstack-graph/services/vs-queryable" {
    import { Observable } from 'rxjs/Observable';
    export class VsQueryable<TResult> {
        private _load;
        private _queryString;
        constructor(_load: (boolean, string) => Observable<TResult>);
        getQueryString(): string;
        toList(): Observable<TResult>;
        withQueryString(queryString: string): VsQueryable<TResult>;
    }
}
declare module "vstack-graph/services/remote.service" {
    import { Observable } from 'rxjs/Observable';
    import { ReplaySubject } from 'rxjs/ReplaySubject';
    import { LocalCollectionService, LocalPersistenceMapper } from "vstack-graph/services/local.service";
    import { CollectionItem } from "vstack-graph/utilities";
    import { VsQueryable } from "vstack-graph/services/vs-queryable";
    export interface RemotePersistenceMapper<TItem extends CollectionItem> extends LocalPersistenceMapper<TItem> {
        load(id: any, options: string): Observable<TItem>;
        loadMany(options: string): Observable<TItem[]>;
    }
    export abstract class BaseRemoteService<TItem extends CollectionItem> extends LocalCollectionService<TItem> {
        private _remotePersistenceMapper;
        constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>);
        _remoteMapper: RemotePersistenceMapper<TItem>;
        protected _assignIds(items: any[]): void;
        protected _load(id: any, options: string): ReplaySubject<TItem>;
        protected _loadMany(isLoadAll: boolean, options: string): ReplaySubject<TItem[]>;
    }
    export abstract class CollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
        constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>);
        get(id: any, options?: string): Observable<TItem>;
        getAll(options?: string): Observable<TItem[]>;
    }
    export abstract class VSCollectionService<TItem extends CollectionItem> extends BaseRemoteService<TItem> {
        constructor(_remotePersistenceMapper: RemotePersistenceMapper<TItem>);
        get(id: any): VsQueryable<TItem>;
        getAll(): VsQueryable<TItem[]>;
    }
}
declare module "vstack-graph/services/angular-http" {
    import { RemotePersistenceMapper } from "vstack-graph/services/remote.service";
    import { Observable } from 'rxjs/Observable';
    import { CollectionItem } from "vstack-graph/utilities";
    export class AngularHttpMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
        protected _baseUrl: string;
        protected _requestOptionsArgs: any;
        private _http;
        constructor({baseUrl, http, options}: {
            baseUrl: string;
            http: any;
            options?: {};
        });
        create(items: TItem[]): Observable<TItem[]>;
        update(items: TItem[]): Observable<TItem[]>;
        delete(ids: any[]): Observable<any>;
        load(id: string, options?: string): any;
        loadMany(options?: string): any;
    }
}
declare module "vstack-graph" {
    import { BaseGraphService } from "vstack-graph/graph/base-graph.service";
    import { ServiceConfig, Relation } from "vstack-graph/graph/graph-utilities";
    import { VSCollectionService, CollectionService } from "vstack-graph/services/remote.service";
    import { LocalCollectionService } from "vstack-graph/services/local.service";
    import { AngularHttpMapper } from "vstack-graph/services/angular-http";
    import { CollectionItem } from "vstack-graph/utilities";
    export { LocalCollectionService, CollectionService, VSCollectionService, BaseGraphService, CollectionItem, ServiceConfig, Relation, AngularHttpMapper };
}
