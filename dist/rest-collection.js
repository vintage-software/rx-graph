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
var core_1 = require('angular2/core');
var Subject_1 = require('rxjs/Subject');
var BehaviorSubject_1 = require('rxjs/subject/BehaviorSubject');
require('rxjs/add/operator/map');
var utilities_1 = require('./utilities');
var RestCollection = (function () {
    function RestCollection(restCollectionConfig) {
        this._collection$ = new BehaviorSubject_1.BehaviorSubject([]);
        this._errors$ = new BehaviorSubject_1.BehaviorSubject({});
        this._history$ = new BehaviorSubject_1.BehaviorSubject({});
        this._history$.subscribe();
        this._baseUrl = restCollectionConfig.baseUrl;
        this._requestOptionsArgs = restCollectionConfig.options;
        this._http = restCollectionConfig.http;
        this._dataStore = { collection: [] };
        this._historyStore = [];
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
    Object.defineProperty(RestCollection.prototype, "history$", {
        get: function () {
            return this._history$;
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
            _this._collection$.next(_this._dataStore.collection);
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
            _this._collection$.next(_this._dataStore.collection);
            completion$.next(data);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.create = function (item, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion$ = new Subject_1.Subject();
        this._apiPost(this._baseUrl, utilities_1.slimify(item)).subscribe(function (data) {
            _this._addCollectionItem(data);
            _this._recordHistory('CREATE');
            _this._collection$.next(_this._dataStore.collection);
            completion$.next(data);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.update = function (item) {
        var _this = this;
        var completion$ = new Subject_1.Subject();
        this._apiPut(this._baseUrl + "/" + item.id, utilities_1.slimify(item)).subscribe(function (data) {
            _this._updateCollectionItem(item.id, data);
            _this._recordHistory('UPDATE');
            _this._collection$.next(_this._dataStore.collection);
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
            _this._collection$.next(_this._dataStore.collection);
            completion$.next(null);
            completion$.complete();
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype._apiGet = function (url, opt) {
        return this._http.get(url, Object.assign({}, this._requestOptionsArgs, opt)).map(function (res) { return res.json(); });
    };
    RestCollection.prototype._apiPost = function (url, val, opt) {
        var body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.post(url, body, Object.assign({}, this._requestOptionsArgs, opt)).map(function (res) { return res.json(); });
    };
    RestCollection.prototype._apiPut = function (url, val, opt) {
        var body = typeof val === 'object' ? JSON.stringify(val) : val;
        return this._http.put(url, body, Object.assign({}, this._requestOptionsArgs, opt)).map(function (res) { return res.json(); });
    };
    RestCollection.prototype._apiDelete = function (url, opt) {
        return this._http.delete(url, Object.assign({}, this._requestOptionsArgs, opt)).map(function (res) { return res.status; });
    };
    RestCollection.prototype._recordHistory = function (action) {
        if (this._historyStore.length >= 100) {
            this._historyStore.shift();
        }
        else {
            this._historyStore.push({ action: action, state: this._dataStore, resource: this._baseUrl });
            this._history$.next(this._historyStore);
        }
    };
    RestCollection.prototype._updateCollection = function (collection) {
        this._dataStore = Object.assign({}, this._dataStore, { collection: collection });
    };
    RestCollection.prototype._addCollectionItem = function (item) {
        this._dataStore = { collection: this._dataStore.collection.concat([item]) };
    };
    RestCollection.prototype._updateCollectionItem = function (id, data) {
        var notFound = true;
        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.map(function (item, index) {
                if (item.id === id) {
                    notFound = false;
                    return Object.assign({}, utilities_1.deepmerge(item, data));
                }
                return item;
            })
        });
        if (notFound) {
            this._dataStore = { collection: this._dataStore.collection.concat([data]) };
        }
    };
    RestCollection.prototype._removeCollectionItem = function (id) {
        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.filter(function (item) { return item.id !== id; })
        });
    };
    RestCollection.prototype._dangerousGraphUpdateCollection = function (items) {
        var _this = this;
        if (items.length) {
            items.forEach(function (i) { return _this._updateCollectionItem(i.id, i); });
            this._recordHistory('GRAPH-UPDATE');
        }
    };
    RestCollection = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object])
    ], RestCollection);
    return RestCollection;
}());
exports.RestCollection = RestCollection;
//# sourceMappingURL=rest-collection.js.map