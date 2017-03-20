import { getPropertyName } from './utilities';

export abstract class BaseFilter {
  abstract getFilterName(): string;
  abstract getParameters(): string[];

  toString() {
    let filterParameters = this.getParameters()
      .map(value => value ? value.replace('_', '\\_') : value)
      .join('_');

    return `${this.getFilterName()}${filterParameters ? `:${filterParameters}` : ''}`.toLowerCase();
  }
}

export abstract class Filter<TItem> extends BaseFilter {
  protected abstract __dummy(): TItem;
}

export abstract class PrimaryFilter<TItem> extends BaseFilter {
  protected abstract __dummy(): TItem;
}

export abstract class ElasticFilter<TItem> extends BaseFilter {
  protected abstract __dummy(): TItem;
}

export abstract class BypassElasticFilter<TItem> extends BaseFilter {
  protected abstract __dummy(): TItem;
}

export enum SortType {
  Ascending,
  Descending
}

export interface SortField<T> {
  field: (t: T) => any;
  sortType: SortType;
}

export class Skip<T> extends ElasticFilter<T> {
  constructor(private skip: number) {
    super();
  }

  public getFilterName(): string {
    return 'Skip';
  }

  public getParameters(): string[] {
    return [this.skip.toString()];
  }

  protected __dummy(): T {
    return null;
  }
}

export class Take<T> extends ElasticFilter<T> {
  constructor(private take: number) {
    super();
  }

  public getFilterName(): string {
    return 'Take';
  }

  public getParameters(): string[] {
    return [this.take.toString()];
  }

  protected __dummy(): T {
    return null;
  }
}

export class TakeAll<T> extends ElasticFilter<T> {
  constructor() {
    super();
  }

  public getFilterName(): string {
    return 'TakeAll';
  }

  public getParameters(): string[] {
    return [];
  }

  protected __dummy(): T {
    return null;
  }
}

export class ByField<T, U> extends ElasticFilter<T> {
  constructor(private field: (t: T) => U, private value: U) {
    super();
  }

  public getFilterName(): string {
    return 'ByField';
  }

  public getParameters(): string[] {
    return [getPropertyName(this.field), encodeURIComponent(this.value.toString())];
  }

  protected __dummy(): T {
    return null;
  }
}

export class ByFieldHasAny<T, U> extends ElasticFilter<T> {
  private field: (t: T) => any;
  private values: any[];

  constructor(field: (t: T) => U[], values: U[]);
  constructor(field: (t: T) => U, values: U[]);
  constructor(field: (t: T) => any, values: any[]) {
    super();
    this.field = field;
    this.values = values;
  }

  public getFilterName(): string {
    return 'ByFieldHasAny';
  }

  public getParameters(): string[] {
    return [getPropertyName(this.field), this.values.map(value => encodeURIComponent(value.toString())).join(',')];
  }

  protected __dummy(): T {
    return null;
  }
}

export class ByFieldHasAll<T, U> extends ElasticFilter<T> {
  constructor(private field: (t: T) => U[], private values: U[]) {
    super();
  }

  public getFilterName(): string {
    return 'ByFieldHasAll';
  }

  public getParameters(): string[] {
    return [getPropertyName(this.field), this.values.map(value => encodeURIComponent(value.toString())).join(',')];
  }

  protected __dummy(): T {
    return null;
  }
}

export class SortBy<T> extends ElasticFilter<T> {
  private fields: SortField<T>[];

  constructor(...fields: SortField<T>[]) {
    super();
    this.fields = fields;
  }

  public getFilterName(): string {
    return 'SortBy';
  }

  public getParameters(): string[] {
    return [this.fields.map(field => `${field.sortType === SortType.Descending ? '-' : ''}${getPropertyName(field.field)}`).join(',')];
  }

  protected __dummy(): T {
    return null;
  }
}
