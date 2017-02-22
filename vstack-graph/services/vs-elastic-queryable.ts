import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { getPropertyName, getPropertyNamesFromProjection } from '../utilities';
import { ElasticFilter, BypassElasticFilter } from '../filters';

export class VsElasticQueryable<TResult> {
  private queryString: string;
  private bypassFilter: string;
  private filters: string[] = [];
  private includes: string[] = [];
  private selects: string[] = [];

  constructor(private load: (boolean, string) => Observable<TResult[]>) { }

  withQueryString(query: string): VsElasticQueryable<TResult> {
    if (this.bypassFilter) {
      throw new Error('Query string cannot be used with bypass filter.');
    }

    if (this.filters.length) {
      throw new Error('Query string cannot be used with filter.');
    }

    if (this.includes.length) {
      throw new Error('Query string cannot be used with include.');
    }

    if (this.selects.length) {
      throw new Error('Query string cannot be used with select');
    }

    this.queryString = query;
    return this;
  }

  filter(filter: ElasticFilter<TResult>): VsElasticQueryable<TResult> {
    if (this.queryString) {
      throw new Error('Elastic filter cannot be used with query string.');
    }

    if (this.bypassFilter) {
      throw new Error('Elastic filters cannot be used with a bypass elastic filter.');
    }

    this.filters.push(filter.toString());
    return this;
  }

  bypass(filter: BypassElasticFilter<TResult>): VsElasticQueryable<TResult> {
    if (this.queryString) {
      throw new Error('Bypass elastic filter cannot be used with query string.');
    }

    if (this.filters.length) {
      throw new Error('A bypass elastic filter cannot be used with elastic filters.');
    }

    this.bypassFilter = filter.toString();
    return this;
  }

  select<TInterface>(projection: (i: TResult) => any): VsElasticQueryable<TInterface> {
    if (this.queryString) {
      throw new Error('Select cannot be used with query string.');
    }

    this.selects = getPropertyNamesFromProjection(projection);

    let queryable: any = this;
    return queryable;
  }

  include(prop: (i: TResult) => any): VsElasticQueryable<TResult>;
  include<T1>(prop1: (i: TResult) => T1[], prop2: (i: T1) => any): VsElasticQueryable<TResult>;
  include<T1, T2>(prop1: (i: TResult) => T1[], prop2: (i: T1) => T2[], prop3: (i: T2) => any): VsElasticQueryable<TResult>;
  include(...props: ((i: any) => any)[]): VsElasticQueryable<TResult> {
    if (this.queryString) {
      throw new Error('Include cannot be used with query string.');
    }

    let propNames = props
      .map(prop => getPropertyName(prop).toLowerCase());

    let propName = propNames.join('.');

    if (this.includes.indexOf(propName) === -1) {
      this.includes.push(propName);
    }

    return this;
  }

  includeElasticMetadata() {
    const meta = '_meta';

    if (this.includes.indexOf(meta) === -1) {
      this.includes.push(meta);
    }

    return this;
  }

  toList(): Observable<TResult[]> {
    let queryString = this.queryString || this.buildQueryString();
    let isLoadAll = !!!queryString;
    return this.load(isLoadAll, queryString);
  }

  firstOrDefault(): Observable<TResult> {
    return this.toList()
      .map(items => items.length ? items[0] : undefined);
  }

  private buildQueryString(): string {
    let queryStringParams: string[] = [];

    if (this.bypassFilter) {
      queryStringParams.push(`bypass=${this.bypassFilter}`);
    }

    if (this.filters.length) {
      queryStringParams.push(`filter=${this.filters.join('|')}`);
    }

    if (this.selects.length) {
      queryStringParams.push(`select=${this.selects.join(',')}`);
    }

    if (this.includes.length) {
      queryStringParams.push(`include=${this.includes.join(',')}`);
    }

    return queryStringParams.join('&');
  }
}
