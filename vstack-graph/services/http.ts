import { Observable } from 'rxjs/Observable';

export interface AngularRequestOptionsArgs {
  headers?: Headers;
}

export enum AngularResponseType {
  Basic = 0,
  Cors = 1,
  Default = 2,
  Error = 3,
  Opaque = 4,
}

export interface AngularResponse {
  type: AngularResponseType;
  ok: boolean;
  url: string;
  status: number;
  statusText: string;
  bytesLoaded: number;
  totalBytes: number;
  headers: Headers;
  json(): any;
  text(): string;
  arrayBuffer(): ArrayBuffer;
  blob(): Blob;
  toString(): string;
}

export interface AngularHttp {
  get(url: string, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  post(url: string, body: any, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  put(url: string, body: any, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  delete(url: string, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  patch(url: string, body: any, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
}
