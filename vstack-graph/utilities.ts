const instrumentationRegex = /__cov_[a-z0-9.$_]+\['[0-9]+'\]\+\+;/ig;

export type Id = string | number;
export type QueryString = { [key: string]: string };

export interface CollectionItem {
  id: Id;
}

export function deepClone<T>(obj: T): T {
  let copy;

  if (null === obj || 'object' !== typeof obj) {
    return obj;
  }

  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Object) {
    copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = deepClone(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error('Unable to copy');
}

export function mergeCollection<TItem extends CollectionItem>(target: TItem[], src: TItem[]) {
  src.filter(i => i && i.id).forEach(srcItem => {
    let match = target.find(tItem => tItem.id === srcItem.id);
    if (target.find(tItem => tItem.id === srcItem.id)) {
      mergeCollectionItem(match, srcItem);
    } else {
      target.push(srcItem);
    }
  });
}

export function mergeCollectionItem<TItem extends CollectionItem>(target: TItem, src: TItem) {
  for (let attrname in src) {
    if (src[attrname] !== undefined || target[attrname + 'Id'] !== src[attrname + 'Id']) {
      target[attrname] = src[attrname];
    }
  }
}

// Slimify is used for sliming down what qualifies as deeply nested non shallow objects
// We slimify objects so when we can remap the new relations when there is a new update to the collection
export function slimify<TItem>(item: TItem) {
  let newItem: any = {};

  for (let prop in item) {
    if (isPrimitive(item[prop])) {
      newItem[prop] = item[prop];
    } else {
      newItem[prop] = null;
    }
  }

  return <TItem>newItem;
}

export function isPrimitive(item: any) {
  return Object.prototype.toString.call(item) === '[object Date]' || typeof item !== 'object' || item === null;
}

export function getPropertyName(expression: (i: any) => any): string {
  /* tslint:disable */
  let memberExpressionRegEx = /^\s*function\s*\(([a-z]+)\)\s*{\s*(?:"use strict";)?\s*return\s+\1\.((?:(?:[a-z]+)\.?)+);?\s*}\s*$/i;
  /* tslint:enable */

  let funcStr = expression.toString().replace(/\n/g, ' ');

  if (typeof(describe) === 'function' && typeof(it) === 'function') {
    funcStr = funcStr.replace(instrumentationRegex, '');
  }

  let funcStrMatch = funcStr.match(memberExpressionRegEx);

  if (!funcStrMatch) {
    throw new Error(`'${funcStr}' is not a valid member expression.`);
  }

  return funcStrMatch[2];
}

export function getPropertyNamesFromProjection(projection: (i: any) => any): string[] {
  /* tslint:disable */
  let projectionExpressionRegEx = /^\s*function\s*\(([a-z]+)\)\s*{\s*(?:"use strict";)?\s*(?:return\s+)?((?:\1\.(?:(?:[a-z]+)\.?),?\s*)+);?\s*}\s*$/i;
  /* tslint:enable */

  let funcStr = projection.toString().replace(/\n/g, ' ');

  if (typeof(describe) === 'function' && typeof(it) === 'function') {
    funcStr = funcStr.replace(instrumentationRegex, '');
  }

  let funcStrMatch = funcStr.match(projectionExpressionRegEx);

  if (!funcStrMatch) {
    throw new Error(`'${funcStr}' is not a valid projection expression.`);
  }

  return funcStrMatch[2]
    .split(',')
    .map(prop => prop.split('.', 2)[1].trim());
}

export function toQueryString(query: QueryString): string {
  let params: string[] = [];

  for (let prop in query) {
    if (query.hasOwnProperty(prop)) {
      params.push(`${prop}=${query[prop]}`);
    }
  }

  return params.join('&');
}

export function parseExplicitTypes(_key: string, value: any) {
  let result = value;

  if (value) {
    const keys = Object.keys(value);
    if (keys.length === 2 && keys.indexOf('_type') > -1 && keys.indexOf('_value') > -1) {
      const explicitType: { type: string, value: any } = { type: value._type, value: value._value };

      switch (explicitType.type) {
        case 'DateTime':
          const dateStr: string = value._value;
          result = dateStr ? new Date(dateStr.replace('T', ' ').replace('Z', '')) : dateStr;
          break;
      }
    }
  }

  return result;
}
