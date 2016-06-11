import { Observable } from 'rxjs/Observable';

export class VsQueryable<TResult> {
  private queryString: string;

  constructor(private load: (boolean, string) => Observable<TResult>) { }

  getQueryString(): string {
    return this.queryString;
  }

  toList(): Observable<TResult> {
    let qs = this.getQueryString();
    let isLoadAll = !!!qs;
    return this.load(isLoadAll, qs);
  }

  withQueryString(queryString: string): VsQueryable<TResult> {
    this.queryString = queryString;
    return this;
  }
}