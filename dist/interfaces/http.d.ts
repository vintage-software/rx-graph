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
export declare enum ResponseType {
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
