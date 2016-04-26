"use strict";
function clone(obj) {
    var copy;
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
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error('Unable to copy');
}
exports.clone = clone;
function mergeCollection(target, src) {
    src.forEach(function (srcItem) {
        var match = target.find(function (tItem) { return tItem.id === srcItem.id; });
        if (match) {
            Object.assign(match, srcItem);
        }
        else {
            target.push(srcItem);
        }
    });
}
exports.mergeCollection = mergeCollection;
function slimify(item) {
    var newItem = {};
    for (var prop in item) {
        if (isPrimitive(item[prop])) {
            newItem[prop] = item[prop];
        }
        else {
            newItem[prop] = null;
        }
    }
    return newItem;
}
exports.slimify = slimify;
function isPrimitive(item) {
    return Object.prototype.toString.call(item) === '[object Date]' || typeof item !== 'object' || item === null;
}
exports.isPrimitive = isPrimitive;
//# sourceMappingURL=utilities.js.map