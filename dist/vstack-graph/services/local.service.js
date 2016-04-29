"use strict";
var ReplaySubject_1 = require('rxjs/ReplaySubject');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
require('rxjs/add/operator/map');
var utilities_1 = require('../utilities');
var LocalCollectionService = (function () {
    function LocalCollectionService(_mapper) {
        this._mapper = _mapper;
        this._collection$ = new BehaviorSubject_1.BehaviorSubject([]);
        this._errors$ = new BehaviorSubject_1.BehaviorSubject({});
        this._history$ = new BehaviorSubject_1.BehaviorSubject({});
        this._dataStore = { collection: [] };
        this._historyStore = [];
        this._recordHistory('INIT');
    }
    Object.defineProperty(LocalCollectionService.prototype, "collection$", {
        get: function () {
            return this._collection$.map(function (collection) { return utilities_1.clone(collection); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalCollectionService.prototype, "errors$", {
        get: function () {
            return this._errors$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalCollectionService.prototype, "history$", {
        get: function () {
            return this._history$;
        },
        enumerable: true,
        configurable: true
    });
    LocalCollectionService.prototype.create = function (item) {
        return this.createMany([item])
            .map(function (items) { return items.find(function (i) { return true; }); });
    };
    LocalCollectionService.prototype.createMany = function (items) {
        var _this = this;
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._assignIds(items);
        this._mapper.create(items.map(function (i) { return utilities_1.slimify(i); })).subscribe(function (items) {
            utilities_1.mergeCollection(_this._dataStore.collection, items);
            _this._recordHistory('CREATE');
            completion$.next(utilities_1.clone(items));
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    LocalCollectionService.prototype.update = function (item) {
        return this.updateMany([item])
            .map(function (items) { return items.find(function (i) { return true; }); });
    };
    LocalCollectionService.prototype.updateMany = function (items) {
        var _this = this;
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._mapper.update(items.map(function (i) { return utilities_1.slimify(i); })).subscribe(function (items) {
            utilities_1.mergeCollection(_this._dataStore.collection, items);
            _this._recordHistory('UPDATE');
            completion$.next(utilities_1.clone(items));
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    LocalCollectionService.prototype.delete = function (id) {
        return this.deleteMany([id])
            .map(function (items) { return items.find(function (i) { return true; }); });
    };
    LocalCollectionService.prototype.deleteMany = function (ids) {
        var _this = this;
        var completion$ = new ReplaySubject_1.ReplaySubject(1);
        this._mapper.delete(ids).subscribe(function (ids) {
            _this._removeCollectionItems(ids);
            _this._recordHistory('DELETE');
            completion$.next(ids);
            completion$.complete();
            _this._collection$.next(_this._dataStore.collection);
        }, function (error) { _this._errors$.next(error); completion$.error(error); });
        return completion$;
    };
    LocalCollectionService.prototype._recordHistory = function (action) {
        if (this._historyStore.length >= 100) {
            this._historyStore.shift();
        }
        this._historyStore.push({ action: action, state: this._dataStore });
        this._history$.next(this._historyStore);
    };
    LocalCollectionService.prototype._removeCollectionItems = function (ids) {
        this._dataStore = Object.assign({}, this._dataStore, {
            collection: this._dataStore.collection.filter(function (item) { return !ids.find(function (id) { return id === item.id; }); })
        });
    };
    LocalCollectionService.prototype._assignIds = function (items) {
        var _this = this;
        items.forEach(function (i) { return i.id = _this._getGuid(); });
    };
    LocalCollectionService.prototype._getGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    return LocalCollectionService;
}());
exports.LocalCollectionService = LocalCollectionService;
//# sourceMappingURL=local.service.js.map