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

export abstract class Filter<TResult> extends BaseFilter {
  protected abstract __dummy(): TResult;
}

export abstract class PrimaryFilter<TResult> extends BaseFilter {
  protected abstract __dummy(): TResult;
}

export abstract class ElasticFilter<TResult> extends BaseFilter {
  protected abstract __dummy(): TResult;
}

export abstract class BypassElasticFilter<TResult> extends BaseFilter {
  protected abstract __dummy(): TResult;
}
