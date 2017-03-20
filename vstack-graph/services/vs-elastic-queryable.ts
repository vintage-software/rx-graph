import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { getPropertyName, getPropertyNamesFromProjection, QueryString } from '../utilities';
import { ElasticFilter, BypassElasticFilter } from '../filters';

export const errors = {
  queryStringAfterBypassFilter: 'Query string cannot be used with bypass elastic filter.',
  queryStringAfterFilter: 'Query string cannot be used with elastic filter.',
  queryStringAfterSelect: 'Query string cannot be used with select.',
  queryStringAfterInclude: 'Query string cannot be used with include.',
  bypassFilterAfterQueryString: 'Bypass elastic filter cannot be used with query string.',
  filterAfterQueryString: 'Elastic filter cannot be used with query string.',
  selectAfterQueryString: 'Select cannot be used with query string.',
  includeAfterQueryString: 'Include cannot be used with query string.',
  bypassFilterAfterFilter: 'Elastic filters cannot be used with a bypass elastic filter.',
  filterAfterBypassFilter: 'A bypass elastic filter cannot be used with elastic filters.'
};

export class VsElasticQueryable<TItem> {
  private queryString: QueryString;
  private bypassFilter: string;
  private filters: string[] = [];
  private includes: string[] = [];
  private selects: string[] = [];

  constructor(private load: (isLoadAll, queryString) => Observable<TItem[]>) { }

  withQueryString(queryString: QueryString): VsElasticQueryable<TItem> {
    if (this.bypassFilter) {
      throw new Error(errors.queryStringAfterBypassFilter);
    }

    if (this.filters.length) {
      throw new Error(errors.queryStringAfterFilter);
    }

    if (this.includes.length) {
      throw new Error(errors.queryStringAfterInclude);
    }

    if (this.selects.length) {
      throw new Error(errors.queryStringAfterSelect);
    }

    this.queryString = queryString;
    return this;
  }

  filter(filter: ElasticFilter<TItem>): VsElasticQueryable<TItem> {
    if (this.queryString) {
      throw new Error(errors.filterAfterQueryString);
    }

    if (this.bypassFilter) {
      throw new Error(errors.filterAfterBypassFilter);
    }

    this.filters.push(filter.toString());
    return this;
  }

  bypass(filter: BypassElasticFilter<TItem>): VsElasticQueryable<TItem> {
    if (this.queryString) {
      throw new Error(errors.bypassFilterAfterQueryString);
    }

    if (this.filters.length) {
      throw new Error(errors.bypassFilterAfterFilter);
    }

    this.bypassFilter = filter.toString();
    return this;
  }

  select<TInterface>(projection: (i: TItem) => any): VsElasticQueryable<TInterface> {
    if (this.queryString) {
      throw new Error(errors.selectAfterQueryString);
    }

    this.selects = getPropertyNamesFromProjection(projection);

    let queryable: any = this;
    return queryable;
  }

  include(prop: (i: TItem) => any): VsElasticQueryable<TItem>;
  include<T1>(prop1: (i: TItem) => T1[], prop2: (i: T1) => any): VsElasticQueryable<TItem>;
  include<T1, T2>(prop1: (i: TItem) => T1[], prop2: (i: T1) => T2[], prop3: (i: T2) => any): VsElasticQueryable<TItem>;
  include(...props: ((i: any) => any)[]): VsElasticQueryable<TItem> {
    if (this.queryString) {
      throw new Error(errors.includeAfterQueryString);
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

  toList(): Observable<TItem[]> {
    let queryString = this.queryString || this.buildQueryString();
    let isLoadAll = !!!queryString;
    return this.load(isLoadAll, queryString);
  }

  firstOrDefault(): Observable<TItem> {
    return this.toList()
      .map(items => items.length ? items[0] : undefined);
  }

  private buildQueryString(): QueryString {
    let queryString: QueryString = {};

    if (this.bypassFilter) {
      queryString['bypass'] = this.bypassFilter;
    }

    if (this.filters.length) {
      queryString['filter'] = this.filters.join('|');
    }

    if (this.selects.length) {
      queryString['select'] = this.selects.join(',');
    }

    if (this.includes.length) {
      queryString['include'] = this.includes.join(',');
    }

    return Object.keys(queryString).length ? queryString : undefined;
  }
}
