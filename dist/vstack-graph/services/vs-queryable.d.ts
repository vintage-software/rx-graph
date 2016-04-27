import { Observable } from 'rxjs/Observable';
export declare class VsQueryable<TResult> {
    private _load;
    private _queryString;
    constructor(_load: (boolean, string) => Observable<TResult>);
    getQueryString(): string;
    toList(): Observable<TResult>;
    withQueryString(queryString: string): VsQueryable<TResult>;
}
