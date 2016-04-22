"use strict";
var ReplaySubject_1 = require('rxjs/subject/ReplaySubject');
var BehaviorSubject_1 = require('rxjs/subject/BehaviorSubject');
require('rxjs/add/operator/map');
var utilities_1 = require('./utilities');
var RestCollection = (function () {
    function RestCollection(_a) {
        var baseUrl = _a.baseUrl, http = _a.http, options = _a.options;
        this._collection$ = new BehaviorSubject_1.BehaviorSubject([]);
        this._errors$ = new BehaviorSubject_1.BehaviorSubject({});
        this._history$ = new BehaviorSubject_1.BehaviorSubject({});
        this._baseUrl = baseUrl;
        this._requestOptionsArgs = options;
        this._http = http;
        this._dataStore = { collection: [] };
        this._historyStore = [];
        this._recordHistory('INIT');
    }
    Object.defineProperty(RestCollection.prototype, "collection$", {
        get: function () {
            return this._collection$.map(function (collection) { return utilities_1.clone(collection); });
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
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._apiGet(this._baseUrl + "?" + options).subscribe(function (data) {
            utilities_1.mergeCollection(_this._dataStore.collection, data);
            _this._recordHistory('LOAD_ALL');
            completion$.next(utilities_1.clone(data));
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.load = function (id, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._apiGet(this._baseUrl + "/" + id + "?" + options).subscribe(function (data) {
            utilities_1.mergeCollection(_this._dataStore.collection, [data]);
            _this._recordHistory('LOAD');
            completion$.next(utilities_1.clone(data));
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.create = function (item, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._apiPost(this._baseUrl, utilities_1.slimify(item)).subscribe(function (data) {
            utilities_1.mergeCollection(_this._dataStore.collection, [data]);
            _this._recordHistory('CREATE');
            completion$.next(utilities_1.clone(data));
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.update = function (item) {
        var _this = this;
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._apiPut(this._baseUrl + "/" + item.id, utilities_1.slimify(item)).subscribe(function (data) {
            utilities_1.mergeCollection(_this._dataStore.collection, [data]);
            _this._recordHistory('UPDATE');
            completion$.next(utilities_1.clone(data));
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    RestCollection.prototype.remove = function (id) {
        var _this = this;
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._apiDelete(this._baseUrl + "/" + id).subscribe(function (response) {
            _this._removeCollectionItem(id);
            _this._recordHistory('REMOVE');
            completion$.next(null);
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
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
    RestCollection.prototype._updateCollectionItem = function (id, data) {
        var notFound = true;
        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.map(function (item, index) {
                if (item.id === id) {
                    notFound = false;
                    return Object.assign(item, data);
                }
                return item;
            })
        });
        if (notFound) {
            this._dataStore = { collection: this._dataStore.collection.concat([data]) };
        }
    };
    return RestCollection;
}());
exports.RestCollection = RestCollection;
//# sourceMappingURL=rest-collection.js.map