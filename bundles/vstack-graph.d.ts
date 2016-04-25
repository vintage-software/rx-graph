/// <reference path="../typings/browser/ambient/es6-shim/es6-shim.d.ts" />
declare module "utilities" {
    export interface CollectionItem {
        id: any;
    }
    export function clone(obj: any): any;
    export function mergeCollection(target: any[], src: any[]): void;
    export function slimify(item: any): any;
    export function isPrimitive(item: any): boolean;
}
declare module "interfaces/http" {
    import { Observable } from 'rxjs/Observable';
    export interface IHttp {
        get(url: string, options?: any): Observable<Response>;
        post(url: string, body: string, options?: any): Observable<Response>;
        put(url: string, body: string, options?: any): Observable<Response>;
        delete(url: string, options?: any): Observable<Response>;
    }
    export interface Response {
        type: any;
        ok: boolean;
        url: string;
        status: number;
        statusText: string;
        bytesLoaded: number;
        totalBytes: number;
        headers: any;
        blob(): any;
        json(): any;
        text(): string;
        arrayBuffer(): any;
    }
    export enum ResponseType {
        basic = 0,
        cors = 1,
        default = 2,
        error = 3,
        opaque = 4,
        opaqueredirect = 5,
    }
    export interface Headers {
        fromResponseHeaderString(headersString: string): Headers;
        append(name: string, value: string): void;
        delete(name: string): void;
        forEach(fn: (values: string[], name: string, headers: Map<string, string[]>) => void): void;
        get(header: string): string;
        has(header: string): boolean;
        keys(): string[];
        set(header: string, value: string | string[]): void;
        values(): string[][];
        toJSON(): {
            [key: string]: any;
        };
        getAll(header: string): string[];
        entries(): any;
    }
    export interface RequestOptionsArgs {
        url: string;
        method: string;
        search: string;
        headers: Headers;
        body: string;
    }
}
declare module "rest-collection" {
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/map';
    import { CollectionItem } from "utilities";
    import { IHttp, RequestOptionsArgs } from "interfaces/http";
    export abstract class RestCollection<TItem extends CollectionItem> {
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
            http: IHttp;
            options?: RequestOptionsArgs | {};
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
        protected _apiDelete(url: string, opt?: any): Observable<number>;
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
    import 'rxjs/add/operator/skip';
    import 'rxjs/add/operator/do';
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
declare module "vstack-graph" {
    import { GraphService } from "graph-service";
    import { RestCollection } from "rest-collection";
    export { GraphService, RestCollection };
}
