import {
  deepClone,
  mergeCollection,
  slimify,
  isPrimitive,
  getPropertyName,
  getPropertyNamesFromProjection,
  getItemsAccountingForPossibleMetadata,
  parseExplicitTypes,
  toQueryString
} from './utilities';

interface Item {
  id: number;
  category: string;
  name: string;
  url: string;
}

describe('deepClone', () => {
  it('should be able to clone Dates, Objects and Arrays', () => {
    let testDate = new Date();
    let testObject = { id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] };
    let testArray = [
      { id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] },
      { id: 2, utcDate: new Date(), accounts: ['Visa', 'Discover'] }];

    expect(deepClone(testDate).getTime()).toBe(testDate.getTime());
    expect(deepClone(testObject).id).toBe(1);
    expect(deepClone(testObject).utcDate.getTime()).toBe(testObject.utcDate.getTime());
    expect(deepClone(testObject).accounts[0]).toBe('Visa');
    expect(deepClone(testArray).length).toBe(2);
  });
});

describe('mergeCollection', () => {
  it('should merge two collections', () => {
    let collection1 = [{ id: 1, value: 'value 1' }, { id: 2, value: 'value 2' }];
    let collection2 = [{ id: 1, value: 'updated value' }, { id: 3, value: 'value 3' }];

    mergeCollection(collection1, collection2);

    expect(collection1[0].value).toBe('updated value');
    expect(collection1.length).toBe(3);
  });
});

describe('slimify', () => {
  it('should be able to slimify objects', () => {
    let complexObject = {
      id: 1,
      name: 'John Doe',
      includedAccounts: ['Visa', 'Mastercard', 'Discover'],
      includedSession: { token: '1234' }
    };

    expect(slimify(complexObject).includedAccounts).toBe(null);
    expect(slimify(complexObject).includedSession).toBe(null);
  });
});

describe('isPrimitive', () => {
  it('should detect primitives', () => {
    expect(isPrimitive('Hello World')).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(42)).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(undefined)).toBe(true);
    expect(isPrimitive(new Date())).toBe(true);

    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
  });
});

describe('getPropertyName', () => {
  it('should get a property name from a function', () => {
    expect(getPropertyName((item: Item) => item.url)).toBe('url');
  });

  it('should throw when the function is not a valid member expression', () => {
    expect(() => getPropertyName((item: Item) => item)).toThrowError();
  });
});

describe('getPropertyNamesFromProjection', () => {
  it('should get a property name from a function', () => {
    expect(getPropertyNamesFromProjection((item: Item) => { return item.id, item.name, item.url; })).toEqual(['id', 'name', 'url']);
  });

  it('should throw when the function is not a valid projection expression', () => {
    expect(() => getPropertyNamesFromProjection((item: Item) => item)).toThrowError();
  });
});

describe('getItemsAccountingForPossibleMetadata', () => {
  it('should allow items array to pass through', () => {
    const items = [ { id: 1 } ];
    expect(getItemsAccountingForPossibleMetadata(items)).toBe(items);
  });

  it('should return `results.items` if `results` is not an array and contains a property named `items` that has an array value', () => {
    const results = { items: [ { id: 1 } ] };
    expect(getItemsAccountingForPossibleMetadata(results)).toBe(results.items);
  });
});

describe('toQueryString', () => {
  it('should convert object to query string', () => {
    const queryString = { };
    queryString['ids'] = '1,2';
    queryString['include'] = 'description';

    expect(toQueryString(queryString)).toBe('ids=1,2&include=description');
  });

  it('should ignore non-own properties', () => {
    const queryString = Object.create({ ignoreme: 'ignoreme' });
    queryString['ids'] = '1,2';
    queryString['include'] = 'description';

    expect(toQueryString(queryString)).toBe('ids=1,2&include=description');
  });
});

describe('parseExplicitTypes', () => {
  it('should allow null or undefined to pass through', () => {
    expect(parseExplicitTypes('', null)).toBeNull();
    expect(parseExplicitTypes('', undefined)).toBeUndefined();
  });
});

describe('parseExplicitTypes (DateTime)', () => {
  const year = 2017;
  const month = 12;
  const dayOfMonth = 19;
  const hours = 17;
  const minutes = 30;

  const explicitDate = {
    _type: 'DateTime',
    _value: `${year}-${month}-${dayOfMonth}T${hours}:${minutes}:00Z`
  };

  let verifyDate = (date: Date) => {
    expect(date instanceof Date).toBe(true);

    expect(date.getFullYear()).toBe(year);
    expect(date.getMonth()).toBe(month - 1);
    expect(date.getDate()).toBe(dayOfMonth);
    expect(date.getHours()).toBe(hours);
    expect(date.getMinutes()).toBe(minutes);
    expect(date.getSeconds()).toBe(0);
  };

  it('should convert explicit date to date object', () => {
    const utcStartDate: Date = parseExplicitTypes('', explicitDate);
    verifyDate(utcStartDate);
  });

  it('should work with JSON.parse', () => {
    const sale = {
      name: 'The very best sale',
      utcStartDate: explicitDate
    };

    const saleJson = JSON.stringify(sale);
    const parsedSale = JSON.parse(saleJson, parseExplicitTypes);

    verifyDate(parsedSale.utcStartDate);
  });

  it('should allow null or undefined to pass though', () => {
    const nullExplicitDate = { _type: 'DateTime', _value: null };
    const undefinedExplicitDate = { _type: 'DateTime', _value: undefined };

    expect(parseExplicitTypes('', nullExplicitDate)).toBeNull();
    expect(parseExplicitTypes('', undefinedExplicitDate)).toBeUndefined();
  });
});
