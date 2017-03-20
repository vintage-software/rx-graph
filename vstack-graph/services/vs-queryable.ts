import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { getPropertyName, getPropertyNamesFromProjection, QueryString } from '../utilities';
import { Filter, PrimaryFilter } from '../filters';

export const errors = {
  queryStringAfterPrimaryFilter: 'Query string cannot be used with primary filter.',
  queryStringAfterFilter: 'Query string cannot be used with filter.',
  queryStringAfterSelect: 'Query string cannot be used with select.',
  queryStringAfterInclude: 'Query string cannot be used with include.',
  primaryFilterAfterQueryString: 'Primary filter cannot be used with query string.',
  filterAfterQueryString: 'Filter cannot be used with query string.',
  selectAfterQueryString: 'Select cannot be used with query string.',
  includeAfterQueryString: 'Include cannot be used with query string.'
};

export class VsQueryable<TItem> {
  private queryString: QueryString;
  private primaryFilter: string;
  private filters: string[] = [];
  private includes: string[] = [];
  private selects: string[] = [];

  constructor(private load: (isLoadAll, queryString) => Observable<TItem[]>) { }

  withQueryString(queryString: QueryString): VsQueryable<TItem> {
    if (this.primaryFilter) {
      throw new Error(errors.queryStringAfterPrimaryFilter);
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

  withPrimaryFilter(filter: PrimaryFilter<TItem>): VsQueryable<TItem> {
    if (this.queryString) {
      throw new Error(errors.primaryFilterAfterQueryString);
    }

    this.primaryFilter = filter.toString();
    return this;
  }

  filter(filter: Filter<TItem>): VsQueryable<TItem> {
    if (this.queryString) {
      throw new Error(errors.filterAfterQueryString);
    }

    this.filters.push(filter.toString());
    return this;
  }

  select<TInterface>(projection: (i: TItem) => any): VsQueryable<TInterface> {
    if (this.queryString) {
      throw new Error(errors.selectAfterQueryString);
    }

    this.selects = getPropertyNamesFromProjection(projection);

    let queryable: any = this;
    return queryable;
  }

  include(prop: (i: TItem) => any): VsQueryable<TItem>;
  include<T1>(prop1: (i: TItem) => T1[], prop2: (i: T1) => any): VsQueryable<TItem>;
  include<T1, T2>(prop1: (i: TItem) => T1[], prop2: (i: T1) => T2[], prop3: (i: T2) => any): VsQueryable<TItem>;
  include(...props: ((i: any) => any)[]): VsQueryable<TItem> {
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

    if (this.primaryFilter) {
      queryString['primary-filter'] = this.primaryFilter;
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
