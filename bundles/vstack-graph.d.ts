/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />
/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />
declare module "utilities" {
    export interface CollectionItem {
        id: any;
    }
    export function clone(obj: any): any;
    export function mergeCollection(target: any[], src: any[]): void;
    export function slimify(item: any): any;
    export function isPrimitive(item: any): boolean;
}
declare module "rest-collection" {
    import { Http, RequestOptionsArgs } from 'angular2/http';
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/map';
    import { CollectionItem } from "utilities";
    export abstract class RestCollection<T extends CollectionItem> {
        protected _baseUrl: string;
        protected _requestOptionsArgs: RequestOptionsArgs;
        private _http;
        private _collection$;
        private _errors$;
        private _history$;
        private _dataStore;
        private _historyStore;
        constructor(restCollectionConfig: {
            baseUrl: string;
            http: Http;
            options?: RequestOptionsArgs;
        });
        collection$: Observable<T[]>;
        errors$: Observable<any>;
        history$: Observable<any>;
        loadAll(options?: string): Observable<Array<T>>;
        load(id: any, options?: string): Observable<T>;
        create(item: any, options?: string): Observable<T>;
        update(item: any): Observable<T>;
        remove(id: any): Observable<T>;
        protected _apiGet(url: string, opt?: any): Observable<any>;
        protected _apiPost(url: string, val: any, opt?: any): Observable<any>;
        protected _apiPut(url: string, val: any, opt?: any): Observable<any>;
        protected _apiDelete(url: string, opt?: any): Observable<number>;
        protected _recordHistory(action: string): void;
        protected _removeCollectionItem(id: any): void;
        _dangerousGraphUpdateCollection(items: T[]): void;
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
        service: RestCollection<TCollectionItem>;
        func: (graph: TGraph, collection: TCollectionItem[]) => void;
        mappings: Mapping[];
        constructor(service: RestCollection<TCollectionItem>, func: (graph: TGraph, collection: TCollectionItem[]) => void, mappings: Mapping[]);
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
