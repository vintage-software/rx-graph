import { Observable } from 'rxjs/Observable';

export interface AngularRequestOptionsArgs {
  headers?: Headers;
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
