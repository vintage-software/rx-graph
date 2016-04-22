import { Observable } from 'rxjs/Observable';
export interface CollectionItem {
    id: any;
}
export declare function clone(obj: any): any;
export declare function mergeCollection(target: any[], src: any[]): void;
export declare function slimify(item: any): any;
export declare function isPrimitive(item: any): boolean;
export interface IHttp<T> {
    get(url: string, options?: T): Observable<any>;
    post(url: string, body: string, options?: T): Observable<any>;
    put(url: string, body: string, options?: T): Observable<any>;
    delete(url: string, options?: T): Observable<any>;
}
