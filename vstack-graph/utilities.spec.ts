import { slimify, isPrimitive, deepClone, mergeCollection, parseExplicitTypes } from './utilities';

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

describe('clone', () => {
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

describe('parseExplicitTypes', () => {
  it('should allow null or undefined to pass though', () => {
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
