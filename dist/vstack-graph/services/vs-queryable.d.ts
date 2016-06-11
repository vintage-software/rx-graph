import { Observable } from 'rxjs/Observable';
export declare class VsQueryable<TResult> {
    private load;
    private queryString;
    constructor(load: (boolean, string) => Observable<TResult>);
    getQueryString(): string;
    toList(): Observable<TResult>;
    withQueryString(queryString: string): VsQueryable<TResult>;
}
