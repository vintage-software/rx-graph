"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require('angular2/http');
var core_1 = require('angular2/core');
var Subject_1 = require('rxjs/Subject');
var BehaviorSubject_1 = require('rxjs/subject/BehaviorSubject');
require('rxjs/add/operator/map');
var RestCollection = (function () {
    function RestCollection(_baseUrl, _http) {
        this._baseUrl = _baseUrl;
        this._http = _http;
        this._collection$ = new BehaviorSubject_1.BehaviorSubject([]);
        this._errors$ = new BehaviorSubject_1.BehaviorSubject({});
        this._store = { collection: [] };
        this._history = [];
        this._recordHistory('INIT');
    }
    Object.defineProperty(RestCollection.prototype, "collection$", {
        get: function () {
            return this._collection$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RestCollection.prototype, "errors$", {
        get: function () {
            return this._errors$;
        },
        enumerable: true,
        configurable: true
    });
    RestCollection.prototype.loadAll = function (options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion$ = new Subject_1.Subject();
        this._apiGet(this._baseUrl + "?" + options).subscribe(function (data) {
            _this._updateCollection(data);
            _this._recordHistory('LOAD_ALL');
            _this._collection$.next(_this._store.collection);
            completion$.next(data);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.load = function (id, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion$ = new Subject_1.Subject();
        this._apiGet(this._baseUrl + "/" + id + "?" + options).subscribe(function (data) {
            _this._updateCollectionItem(data.id, data);
            _this._recordHistory('LOAD');
            _this._collection$.next(_this._store.collection);
            completion$.next(data);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.create = function (item, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion$ = new Subject_1.Subject();
        this._apiPost(this._baseUrl, this._slimify(item)).subscribe(function (data) {
            _this._addCollectionItem(data);
            _this._recordHistory('CREATE');
            _this._collection$.next(_this._store.collection);
            completion$.next(data);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.update = function (item) {
        var _this = this;
        var completion$ = new Subject_1.Subject();
        this._apiPut(this._baseUrl + "/" + item.id, this._slimify(item)).subscribe(function (data) {
            _this._updateCollectionItem(item.id, data);
            _this._recordHistory('UPDATE');
            _this._collection$.next(_this._store.collection);
            completion$.next(data);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.remove = function (id) {
        var _this = this;
        var completion$ = new Subject_1.Subject();
        this._apiDelete(this._baseUrl + "/" + id).subscribe(function (response) {
            _this._removeCollectionItem(id);
            _this._recordHistory('REMOVE');
            _this._collection$.next(_this._store.collection);
            completion$.next(null);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.updateCollection = function (items) {
        var _this = this;
        if (items.length) {
            items.forEach(function (i) { return _this._updateCollectionItem(i.id, i); });
            this._recordHistory('MASTER-UPDATE');
        }
    };
    RestCollection.prototype._apiGet = function (url, opt) {
        var options = Object.assign({}, this._requestOptionsArgs, opt);
        return this._http.get(url, options)
            .map(function (res) { return res.json(); });
    };
    RestCollection.prototype._apiPost = function (url, val, opt) {
        var options = Object.assign({}, this._requestOptionsArgs, opt);
        var body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.post(url, body, options)
            .map(function (res) { return res.json(); });
    };
    RestCollection.prototype._apiPut = function (url, val, opt) {
        var options = Object.assign({}, this._requestOptionsArgs, opt);
        var body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.put(url, body, options)
            .map(function (res) { return res.json(); });
    };
    RestCollection.prototype._apiDelete = function (url, opt) {
        var options = Object.assign({}, this._requestOptionsArgs, opt);
        return this._http.delete(url, options)
            .map(function (res) { return res.status; });
    };
    RestCollection.prototype._recordHistory = function (action) {
        if (RestCollection.debug) {
            if (this._history.length >= 100) {
                this._history.shift();
            }
            else {
                this._history.push({ action: action, state: this._store, resource: this._baseUrl });
            }
            console.log(this._history.slice(-1)[0]);
        }
    };
    RestCollection.prototype._updateCollection = function (collection) {
        this._store = Object.assign({}, this._store, { collection: collection });
    };
    RestCollection.prototype._addCollectionItem = function (item) {
        this._store = { collection: this._store.collection.concat([item]) };
    };
    RestCollection.prototype._updateCollectionItem = function (id, data) {
        var _this = this;
        var notFound = true;
        this._store = Object.assign({}, this._store, {
            collection: this._store.collection.map(function (item, index) {
                if (item.id === id) {
                    notFound = false;
                    return Object.assign({}, _this._deepmerge(item, data));
                }
                return item;
            })
        });
        if (notFound) {
            this._store = { collection: this._store.collection.concat([data]) };
        }
    };
    RestCollection.prototype._removeCollectionItem = function (id) {
        this._store = Object.assign({}, this._store, {
            collection: this._store.collection.filter(function (item) { return item.id !== id; })
        });
    };
    RestCollection.prototype._clone = function (obj) {
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
                copy[i] = this._clone(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = this._clone(obj[attr]);
            }
            return copy;
        }
        throw new Error('Unable to copy');
    };
    RestCollection.prototype._slimify = function (item) {
        var newItem = {};
        for (var prop in item) {
            if (this._isPrimitive(item[prop])) {
                newItem[prop] = item[prop];
            }
            else {
                newItem[prop] = null;
            }
        }
        return newItem;
    };
    RestCollection.prototype._deepmerge = function (target, src) {
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
                    dst[i] = this._deepmerge(target[i], e);
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
                        dst[key] = this._deepmerge(target[key], src[key]);
                    }
                }
            });
        }
        return dst;
    };
    RestCollection.prototype._isPrimitive = function (item) {
        return Object.prototype.toString.call(item) === '[object Date]'
            || typeof item !== 'object';
    };
    RestCollection.debug = false;
    RestCollection = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [String, http_1.Http])
    ], RestCollection);
    return RestCollection;
}());
exports.RestCollection = RestCollection;
//# sourceMappingURL=rest-collection.js.map