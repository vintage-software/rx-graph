import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Filter, PrimaryFilter } from '../filters';
import { QueryString } from '../utilities';
import { errors, VsQueryable } from './vs-queryable';

interface Item {
  id: number;
  name: string;
  description: string;
}

const items: Item[] = [
  { id: 1, name: 'Item 1', description: 'very cool item' }
];

const queryString: QueryString = { include: 'description' };

describe('VsQueryable', () => {
  it('should allow custom query string', () => {
    const queryStringThatWasPassedToQueryable: QueryString = { include: 'description' };
    let queryStringSentToServer: QueryString = undefined;

    const load = (isLoadAll: boolean, options: QueryString) => {
      queryStringSentToServer = options;
      return Observable.of(items);
    };

    new VsQueryable(load)
      .withQueryString(queryStringThatWasPassedToQueryable)
      .toList()
      .subscribe(() => {});

    expect(queryStringSentToServer).toBe(queryStringThatWasPassedToQueryable);
  });

  it('should correctly build query string with typed options', () => {
    let primaryFilter: string = undefined;
    let filter: string = undefined;
    let include: string = undefined;
    let select: string = undefined;

    const load = (isLoadAll: boolean, options: QueryString) => {
      primaryFilter = options['primary-filter'];
      filter = options['filter'];
      include = options['include'];
      select = options['select'];
      return Observable.of(items);
    };

    new VsQueryable(load)
      .withPrimaryFilter(new ByNamePrimaryFilter('Toy'))
      .filter(new ByNameFilter('Toy'))
      .filter(new ByNameFilter('Gift'))
      .include(item => item.name)
      .include(item => item.description)
      .select(item => { return item.id, item.name; })
      .toList()
      .subscribe(() => {});

    expect(primaryFilter).toBe('byname:toy');
    expect(filter).toBe('byname:toy|byname:gift');
    expect(include).toBe('name,description');
    expect(select).toBe('id,name');
  });

  it('should not allow typed options after custom query string', () => {
    const load = (isLoadAll: boolean, options: QueryString) => {
      return Observable.of(items);
    };

    const query = () => new VsQueryable(load).withQueryString(queryString);
    const queryStringThenPrimaryFilter = () => query().withPrimaryFilter(new ByNamePrimaryFilter('Toy'));
    const queryStringThenFilter = () => query().filter(new ByNameFilter('Toy'));
    const queryStringThenSelect = () => query().select(item => { return item.id, item.name; });
    const queryStringThenInclude = () => query().include(item => item.description);

    expect(queryStringThenPrimaryFilter).toThrow(new Error(errors.primaryFilterAfterQueryString));
    expect(queryStringThenFilter).toThrow(new Error(errors.filterAfterQueryString));
    expect(queryStringThenSelect).toThrow(new Error(errors.selectAfterQueryString));
    expect(queryStringThenInclude).toThrow(new Error(errors.includeAfterQueryString));
  });

  it('should not allow custom query string after typed options', () => {
    const load = (isLoadAll: boolean, options: QueryString) => {
      return Observable.of(items);
    };

    const query = () => new VsQueryable(load);
    const primaryFilterThenQueryString = () => query().withPrimaryFilter(new ByNamePrimaryFilter('Toy')).withQueryString(queryString);
    const filterThenQueryString = () => query().filter(new ByNameFilter('Toy')).withQueryString(queryString);
    const selectThenQueryString = () => query().select(item => { return item.id, item.name; }).withQueryString(queryString);
    const includeThenQueryString = () => query().include(item => item.description).withQueryString(queryString);

    expect(primaryFilterThenQueryString).toThrow(new Error(errors.queryStringAfterPrimaryFilter));
    expect(filterThenQueryString).toThrow(new Error(errors.queryStringAfterFilter));
    expect(selectThenQueryString).toThrow(new Error(errors.queryStringAfterSelect));
    expect(includeThenQueryString).toThrow(new Error(errors.queryStringAfterInclude));
  });
});

class ByNamePrimaryFilter extends PrimaryFilter<Item> {
  constructor(private name: string) {
    super();
  }

  public getFilterName(): string {
    return 'ByName';
  }

  public getParameters(): string[] {
    return [encodeURIComponent(this.name)];
  }

  protected __dummy(): Item {
    return null;
  }
}

class ByNameFilter extends Filter<Item> {
  constructor(private name: string) {
    super();
  }

  public getFilterName(): string {
    return 'ByName';
  }

  public getParameters(): string[] {
    return [encodeURIComponent(this.name)];
  }

  protected __dummy(): Item {
    return null;
  }
}
