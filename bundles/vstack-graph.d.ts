/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />
/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />
declare module "rest-collection" {
    import { Http, RequestOptionsArgs } from 'angular2/http';
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/map';
    import { Dto } from "utilities";
    export abstract class RestCollection<T extends Dto> {
        protected _baseUrl: string;
        private _http;
        protected _requestOptionsArgs: RequestOptionsArgs;
        private _collection$;
        private _errors$;
        private _history$;
        private _dataStore;
        private _historyStore;
        constructor(_baseUrl: string, _http: Http);
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
        protected _updateCollection(collection: any[]): void;
        protected _addCollectionItem(item: any): void;
        protected _updateCollectionItem(id: any, data: any): void;
        protected _removeCollectionItem(id: any): void;
        _dangerousGraphUpdateCollection(items: T[]): void;
    }
}
declare module "utilities" {
    import { Observable } from 'rxjs/Observable';
    import { RestCollection } from "rest-collection";
    export interface Dto {
        id: any;
    }
    export interface IService {
        collection$: Observable<any[]>;
        errors$: Observable<any>;
        _dangerousGraphUpdateCollection: any;
    }
    export interface IServiceConfig<TGraph> {
        service: IService;
        func: (graph: TGraph, collection: any[]) => void;
        mappings: Mapping[];
    }
    export class Mapping {
        collectionProperty: string;
        to: IService;
        mappingId: string;
        many: boolean;
        constructor(collectionProperty: string, to: IService, mappingId: string, many: boolean);
    }
    export class ServiceConfig<TDto extends Dto, TGraph> implements IServiceConfig<TGraph> {
        service: RestCollection<TDto>;
        func: (graph: TGraph, collection: TDto[]) => void;
        mappings: Mapping[];
        constructor(service: RestCollection<TDto>, func: (graph: TGraph, collection: TDto[]) => void, mappings: Mapping[]);
    }
    export function clone(obj: any): any;
    export function deepmerge(target: any, src: any): any;
    export function slimify(item: any): any;
    export function isPrimitive(item: any): boolean;
}
declare module "graph-service" {
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/combineLatest';
    import { IServiceConfig } from "utilities";
    export class GraphService<TGraph> {
        private _serviceConfigs;
        private _debug;
        private _master$;
        constructor(_serviceConfigs: IServiceConfig<TGraph>[]);
        graph$: Observable<TGraph>;
        private _slimify(masterObs);
        private _combine(arr1, arr2);
        private _copy(masterObs);
        private _toGraph(masterObs);
    }
}
declare module "rest-collection.spec" {
}
