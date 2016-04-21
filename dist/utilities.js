"use strict";
var Mapping = (function () {
    function Mapping(collectionProperty, to, mappingId, many) {
        this.collectionProperty = collectionProperty;
        this.to = to;
        this.mappingId = mappingId;
        this.many = many;
    }
    return Mapping;
}());
exports.Mapping = Mapping;
var ServiceConfig = (function () {
    function ServiceConfig(service, func, mappings) {
        this.service = service;
        this.func = func;
        this.mappings = mappings;
    }
    return ServiceConfig;
}());
exports.ServiceConfig = ServiceConfig;
function clone(obj) {
    var copy;
    if (null == obj || "object" != typeof obj)
        return obj;
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
function deepmerge(target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};
    if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function (e, i) {
            if (typeof dst[i] === 'undefined') {
                dst[i] = e;
            }
            else if (typeof e === 'object') {
                dst[i] = deepmerge(target[i], e);
            }
            else {
                if (target.indexOf(e) === -1) {
                    dst.push(e);
                }
            }
        });
    }
    else {
        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            });
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                dst[key] = src[key];
            }
            else {
                if (!target[key]) {
                    dst[key] = src[key];
                }
                else {
                    dst[key] = deepmerge(target[key], src[key]);
                }
            }
        });
    }
    return dst;
}
exports.deepmerge = deepmerge;
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
    return Object.prototype.toString.call(item) === '[object Date]'
        || typeof item !== 'object';
}
exports.isPrimitive = isPrimitive;
//# sourceMappingURL=utilities.js.map