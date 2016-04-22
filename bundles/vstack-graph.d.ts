/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />
/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />
declare module "utilities" {
    import { Observable } from 'rxjs/Observable';
    export interface CollectionItem {
        id: any;
    }
    export function clone(obj: any): any;
    export function mergeCollection(target: any[], src: any[]): void;
    export function slimify(item: any): any;
    export function isPrimitive(item: any): boolean;
    export interface IHttp<T> {
        get(url: string, options?: T): Observable<any>;
        post(url: string, body: string, options?: T): Observable<any>;
        put(url: string, body: string, options?: T): Observable<any>;
        delete(url: string, options?: T): Observable<any>;
    }
}
declare module "rest-collection" {
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/map';
    import { CollectionItem, IHttp } from "utilities";
    export abstract class RestCollection<TItem extends CollectionItem, TOptions> {
        protected _baseUrl: string;
        protected _requestOptionsArgs: any;
        private _http;
        private _collection$;
        private _errors$;
        private _history$;
        private _dataStore;
        private _historyStore;
        constructor({baseUrl, http, options}: {
            baseUrl: string;
            http: IHttp<TOptions>;
            options?: TOptions;
        });
        collection$: Observable<TItem[]>;
        errors$: Observable<any>;
        history$: Observable<any>;
        loadAll(options?: string): Observable<Array<TItem>>;
        load(id: any, options?: string): Observable<TItem>;
        create(item: any, options?: string): Observable<TItem>;
        update(item: any): Observable<TItem>;
        remove(id: any): Observable<TItem>;
        protected _apiGet(url: string, opt?: any): Observable<any>;
        protected _apiPost(url: string, val: any, opt?: any): Observable<any>;
        protected _apiPut(url: string, val: any, opt?: any): Observable<any>;
        protected _apiDelete(url: string, opt?: any): Observable<any>;
        protected _recordHistory(action: string): void;
        protected _removeCollectionItem(id: any): void;
        _dangerousGraphUpdateCollection(items: TItem[]): void;
        protected _updateCollectionItem(id: any, data: any): void;
    }
}
declare module "graph-helpers" {
    import { Observable } from 'rxjs/Observable';
    import { RestCollection } from "rest-collection";
    import { CollectionItem } from "utilities";
    export interface IService {
        collection$: Observable<CollectionItem[]>;
        errors$: Observable<any>;
    }
    export interface IServiceConfig<TGraph> {
        service: IService;
        func: (graph: TGraph, collection: CollectionItem[]) => void;
        mappings: Mapping[];
    }
    export class Mapping {
        collectionProperty: string;
        to: IService;
        mappingId: string;
        many: boolean;
        constructor(collectionProperty: string, to: IService, mappingId: string, many: boolean);
    }
    export class ServiceConfig<TCollectionItem extends CollectionItem, TGraph> implements IServiceConfig<TGraph> {
        service: RestCollection<TCollectionItem, any>;
        func: (graph: TGraph, collection: TCollectionItem[]) => void;
        mappings: Mapping[];
        constructor(service: RestCollection<TCollectionItem, any>, func: (graph: TGraph, collection: TCollectionItem[]) => void, mappings: Mapping[]);
    }
}
declare module "graph-service" {
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/combineLatest';
    import 'rxjs/add/operator/startWith';
    import 'rxjs/Rx';
    import { IServiceConfig } from "graph-helpers";
    export class GraphService<TGraph> {
        private _serviceConfigs;
        private _debug;
        graph$: Observable<TGraph>;
        constructor(_serviceConfigs: IServiceConfig<TGraph>[]);
        private _slimify(master);
        private _combine(arr1, arr2);
        private _copy(masterObs);
        private _toGraph(master);
    }
}
declare module "graph-service.spec" {
}
declare module "rest-collection.spec" {
}
declare module "utilities.spec" {
}
