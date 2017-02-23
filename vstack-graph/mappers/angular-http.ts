import { Observable } from 'rxjs/Observable';

export interface AngularHeaders {
  append(name: string, value: string): void;
  delete(name: string): void;
  forEach(fn: (values: string[], name: string, headers: Map<string, string[]>) => void): void;
  get(name: string): string;
  has(name: string): boolean;
  keys(): string[];
  set(name: string, value: string | string[]): void;
  values(): string[][];
  toJSON(): { [name: string]: any; };
  getAll(name: string): string[];
}

export interface AngularRequestOptionsArgs {
  headers?: AngularHeaders;
}

export interface AngularResponse {
  status: number;
  json(): any;
  text(): string;
}

export interface AngularHttp {
  get(url: string, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  post(url: string, body: any, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  put(url: string, body: any, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  delete(url: string, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
  patch(url: string, body: any, options?: AngularRequestOptionsArgs): Observable<AngularResponse>;
}
