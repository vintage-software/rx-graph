import {Observable} from 'rxjs/Observable';
import {RestCollection} from './rest-collection';

export interface CollectionItem {
    id: any;
}

export interface IService {
    collection$: Observable<any[]>;
    errors$: Observable<any>;
    _dangerousGraphUpdateCollection: any;
}

export interface IServiceConfig<TGraph> {
    service: IService;
    func: (graph: TGraph, collection: any[]) => void;
    mappings: Mapping[];
}

export class Mapping {
    constructor(public collectionProperty: string, public to: IService, public mappingId: string, public many: boolean) { }
}

export class ServiceConfig<TCollectionItem extends CollectionItem, TGraph> implements IServiceConfig<TGraph> {
    constructor(public service: RestCollection<TCollectionItem>, public func: (graph: TGraph, collection: TCollectionItem[]) => void, public mappings: Mapping[]) { }
}

export function clone(obj) {
    let copy;

    if (null == obj || "object" != typeof obj) return obj;

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error('Unable to copy');
}

export function deepmerge(target, src) {
    let array = Array.isArray(src);
    let dst: any = array && [] || {};

    if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function (e, i) {
          if (typeof dst[i] === 'undefined') {
              dst[i] = e;
          } else if (typeof e === 'object') {
              dst[i] = deepmerge(target[i], e);
          } else {
              if (target.indexOf(e) === -1) {
                  dst.push(e);
              }
          }
        });
    } else {
      if (target && typeof target === 'object') {
          Object.keys(target).forEach(function (key) {
              dst[key] = target[key];
          })
      }
      Object.keys(src).forEach(function (key) {
          if (typeof src[key] !== 'object' || !src[key]) {
              dst[key] = src[key];
          } else {
              if (!target[key]) {
                  dst[key] = src[key];
              } else {
                  dst[key] = deepmerge(target[key], src[key]);
              }
          }
      });
    }

    return dst;
}

export function slimify(item: any): any {
  let newItem = {};

  for (let prop in item) {
      if (isPrimitive(item[prop])) {
          newItem[prop] = item[prop];
      } else {
          newItem[prop] = null;
      }
  }

  return newItem;
}

export function isPrimitive(item: any) {
    return Object.prototype.toString.call(item) === '[object Date]' || typeof item !== 'object' || item === null;
}