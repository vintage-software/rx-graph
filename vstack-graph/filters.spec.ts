import { SortType, ByFieldHasAny, ByFieldHasAll, SortBy, ByField, TakeAll, Take, Skip, ElasticFilter } from './filters';
import { slimify, isPrimitive, deepClone, mergeCollection } from './utilities';

class Test {
  id: number;
  name: string;
  tags: string[];
}

const message = '';

const testFilter = (filter: ElasticFilter<Test>) => {
  let params = filter.getParameters();
  console.log(params);
  return `${filter.getFilterName()}${params.length ? ':' : ''}${params.join('_')}`;
};

describe('skip filter', () => {
  it(message, () => {
    expect(testFilter(new Skip<Test>(10))).toBe('Skip:10');
  });
});

describe('take filter', () => {
  it(message, () => {
    expect(testFilter(new Take<Test>(10))).toBe('Take:10');
  });
});

describe('takeAll filter', () => {
  it(message, () => {
    expect(testFilter(new TakeAll<Test>())).toBe('TakeAll');
  });
});

describe('ByField filter', () => {
  it(message, () => {
    expect(testFilter(new ByField((i: Test) => i.id, 3))).toBe('ByField:id_3');
  });
});

describe('ByFieldHasAny filter', () => {
  it(message, () => {
    expect(testFilter(new ByFieldHasAny((i: Test) => i.id, [1, 2, 3]))).toBe('ByFieldHasAny:id_1,2,3');
    expect(testFilter(new ByFieldHasAny((i: Test) => i.tags, ['a', 'b', 'c']))).toBe('ByFieldHasAny:tags_a,b,c');
  });
});

describe('ByFieldHasAll filter', () => {
  it(message, () => {
    expect(testFilter(new ByFieldHasAll((i: Test) => i.tags, ['a', 'b', 'c']))).toBe('ByFieldHasAll:tags_a,b,c');
  });
});

describe('SortBy filter', () => {
  it(message, () => {
    let idSort = {
      field: i => i.id,
      sortType: SortType.Ascending
    };

    let nameSortDescending = {
      field: i => i.name,
      sortType: SortType.Descending
    };

    expect(testFilter(new SortBy(idSort, nameSortDescending))).toBe('SortBy:id,-name');
  });
});
