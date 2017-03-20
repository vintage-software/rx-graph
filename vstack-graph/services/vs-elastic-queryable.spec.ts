import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { BypassElasticFilter, ElasticFilter } from '../filters';
import { QueryString } from '../utilities';
import { errors, VsElasticQueryable } from './vs-elastic-queryable';

interface Item {
  id: number;
  name: string;
  description: string;
}

const items: Item[] = [
  { id: 1, name: 'Item 1', description: 'very cool item' }
];

const queryString: QueryString = { include: 'description' };

describe('VsElasticQueryable', () => {
  it('should allow custom query string', () => {
    const queryStringThatWasPassedToQueryable: QueryString = { include: 'description' };
    let queryStringSentToServer: QueryString = undefined;

    const load = (isLoadAll: boolean, options: QueryString) => {
      queryStringSentToServer = options;
      return Observable.of(items);
    };

    new VsElasticQueryable(load)
      .withQueryString(queryStringThatWasPassedToQueryable)
      .toList()
      .subscribe(() => {});

    expect(queryStringSentToServer).toBe(queryStringThatWasPassedToQueryable);
  });

  it('should correctly build query string with filters', () => {
    let bypass: string = undefined;
    let filter: string = undefined;
    let include: string = undefined;
    let select: string = undefined;
    let aggsMetadata: string = undefined;

    const load = (isLoadAll: boolean, options: QueryString) => {
      bypass = options['bypass'];
      filter = options['filter'];
      include = options['include'];
      select = options['select'];
      aggsMetadata = options['aggsMetadata'];
      return Observable.of(items);
    };

    const queryable = new VsElasticQueryable(load)
      .filter(new ByNameElasticFilter('Toy'))
      .filter(new ByNameElasticFilter('Gift'))
      .include(item => item.name)
      .include(item => item.description)
      .include(item => item.description) // should not be added twice
      .includeElasticMetadata()
      .includeElasticMetadata() // should not be added twice
      .select(item => { return item.id, item.name; });

    const test = (observable: Observable<any>, withAggs = false) => {
      observable
        .subscribe(() => {});

      expect(bypass).toBe(undefined);
      expect(filter).toBe('byname:toy|byname:gift');
      expect(include).toBe('name,description,_meta');
      expect(select).toBe('id,name');

      if (withAggs) {
        expect(aggsMetadata).toBe('true');
      } else {
        expect(aggsMetadata).toBeUndefined();
      }
    };

    test(queryable.toList());
    test(queryable.toListWithAggs(), true);
    test(queryable.firstOrDefault());
  });

  it('should correctly build query string with bypass filter', () => {
    let bypass: string = undefined;
    let filter: string = undefined;
    let include: string = undefined;
    let select: string = undefined;

    const load = (isLoadAll: boolean, options: QueryString) => {
      bypass = options['bypass'];
      filter = options['filter'];
      include = options['include'];
      select = options['select'];
      return Observable.of(items);
    };

    new VsElasticQueryable(load)
      .bypass(new ByNameBypassElasticFilter('Toy'))
      .include(item => item.name)
      .include(item => item.description)
      .select(item => { return item.id, item.name; })
      .toList()
      .subscribe(() => {});

    expect(bypass).toBe('byname:toy');
    expect(filter).toBe(undefined);
    expect(include).toBe('name,description');
    expect(select).toBe('id,name');
  });

  it('should not allow typed options after custom query string', () => {
    const load = (isLoadAll: boolean, options: QueryString) => {
      return Observable.of(items);
    };

    const query = () => new VsElasticQueryable(load).withQueryString(queryString);
    const queryStringThenBypassFilter = () => query().bypass(new ByNameBypassElasticFilter('Toy'));
    const queryStringThenFilter = () => query().filter(new ByNameElasticFilter('Toy'));
    const queryStringThenSelect = () => query().select(item => { return item.id, item.name; });
    const queryStringThenInclude = () => query().include(item => item.description);

    expect(queryStringThenBypassFilter).toThrowError(errors.bypassFilterAfterQueryString);
    expect(queryStringThenFilter).toThrowError(errors.filterAfterQueryString);
    expect(queryStringThenSelect).toThrowError(errors.selectAfterQueryString);
    expect(queryStringThenInclude).toThrowError(errors.includeAfterQueryString);
  });

  it('should not allow custom query string after typed options', () => {
    const load = (isLoadAll: boolean, options: QueryString) => {
      return Observable.of(items);
    };

    const query = () => new VsElasticQueryable(load);
    const bypassFilterThenQueryString = () => query().bypass(new ByNameBypassElasticFilter('Toy')).withQueryString(queryString);
    const filterThenQueryString = () => query().filter(new ByNameElasticFilter('Toy')).withQueryString(queryString);
    const selectThenQueryString = () => query().select(item => { return item.id, item.name; }).withQueryString(queryString);
    const includeThenQueryString = () => query().include(item => item.description).withQueryString(queryString);

    expect(bypassFilterThenQueryString).toThrowError(errors.queryStringAfterBypassFilter);
    expect(filterThenQueryString).toThrowError(errors.queryStringAfterFilter);
    expect(selectThenQueryString).toThrowError(errors.queryStringAfterSelect);
    expect(includeThenQueryString).toThrowError(errors.queryStringAfterInclude);
  });

  it('should not allow a normal elastic filter and a bypass elastic filter to be used together', () => {
    const load = (isLoadAll: boolean, options: QueryString) => {
      return Observable.of(items);
    };

    const query = () => new VsElasticQueryable(load);
    const bypassThenNormalFilter = () => query().bypass(new ByNameBypassElasticFilter('Toy')).filter(new ByNameElasticFilter('Toy'));
    const normalThenBypassFilter = () => query().filter(new ByNameElasticFilter('Toy')).bypass(new ByNameBypassElasticFilter('Toy'));

    expect(bypassThenNormalFilter).toThrowError(errors.filterAfterBypassFilter);
    expect(normalThenBypassFilter).toThrowError(errors.bypassFilterAfterFilter);
  });
});

class ByNameBypassElasticFilter extends BypassElasticFilter<Item> {
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

class ByNameElasticFilter extends ElasticFilter<Item> {
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
