import {Observable} from 'rxjs/Observable';

export interface CollectionItem {
    id: any;
}

export function clone(obj) {
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

export function mergeCollection<TItem extends CollectionItem>(target: TItem[], src: TItem[]) {
    src.filter(i => i && i.id).forEach(srcItem => {
        let match = target.find(tItem => tItem.id === srcItem.id);
        if (match) {
            Object.assign(match, srcItem)
        } else {
            target.push(srcItem);
        }
    });
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