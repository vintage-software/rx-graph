import {Observable} from 'rxjs/Observable';

export class VsQueryable<TResult> {
    private _queryString: string;

    constructor(private _load: (boolean, string) => Observable<TResult>) {
    }

    getQueryString(): string {
        return this._queryString;
    }

    toList(): Observable<TResult> {
        let qs = this.getQueryString();
        let isLoadAll = !!!qs;
        return this._load(isLoadAll, qs);
    }

    withQueryString(queryString: string): VsQueryable<TResult> {
        this._queryString = queryString;
        return this;
    }
}