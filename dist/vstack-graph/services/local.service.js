"use strict";
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/map");
var utilities_1 = require("../utilities");
var LocalCollectionService = (function () {
    function LocalCollectionService(_mapper) {
        this._mapper = _mapper;
        this._collection = new BehaviorSubject_1.BehaviorSubject([]);
        this._errors = new Subject_1.Subject();
        this._history = new Subject_1.Subject();
        this.dataStore = { collection: [] };
        this.historyStore = [];
        this.recordHistory('INIT');
    }
    Object.defineProperty(LocalCollectionService.prototype, "collection", {
        get: function () {
            return this._collection.map(function (collection) { return utilities_1.clone(collection); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalCollectionService.prototype, "errors", {
        get: function () {
            return this._errors.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalCollectionService.prototype, "history", {
        get: function () {
            return this._history.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    LocalCollectionService.prototype.create = function (item, options) {
        if (options === void 0) { options = ''; }
        return this.createMany([item], options).map(function (items) { return items.find(function (i) { return true; }); });
    };
    LocalCollectionService.prototype.createMany = function (items, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion = new ReplaySubject_1.ReplaySubject(1);
        this.assignIds(items);
        this._mapper.create(items.map(function (i) { return utilities_1.slimify(i); }), options).subscribe(function (items) {
            utilities_1.mergeCollection(_this.dataStore.collection, items);
            _this.recordHistory('CREATE');
            completion.next(utilities_1.clone(items));
            completion.complete();
            _this._collection.next(_this.dataStore.collection);
        }, function (error) { _this._errors.next(error); completion.error(error); });
        return completion;
    };
    LocalCollectionService.prototype.update = function (item, options) {
        if (options === void 0) { options = ''; }
        return this.updateMany([item], options).map(function (items) { return items.find(function (i) { return true; }); });
    };
    LocalCollectionService.prototype.updateMany = function (items, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion = new ReplaySubject_1.ReplaySubject(1);
        this._mapper.update(items.map(function (i) { return utilities_1.slimify(i); }), options).subscribe(function (items) {
            utilities_1.mergeCollection(_this.dataStore.collection, items);
            _this.recordHistory('UPDATE');
            completion.next(utilities_1.clone(items));
            completion.complete();
            _this._collection.next(_this.dataStore.collection);
        }, function (error) { _this._errors.next(error); completion.error(error); });
        return completion;
    };
    LocalCollectionService.prototype.delete = function (id, options) {
        if (options === void 0) { options = ''; }
        return this.deleteMany([id], options).map(function (items) { return items.find(function (i) { return true; }); });
    };
    LocalCollectionService.prototype.deleteMany = function (ids, options) {
        var _this = this;
        if (options === void 0) { options = ''; }
        var completion = new ReplaySubject_1.ReplaySubject(1);
        this._mapper.delete(ids, options).subscribe(function () {
            _this.removeCollectionItems(ids);
            _this.recordHistory('DELETE');
            completion.next(ids);
            completion.complete();
            _this._collection.next(_this.dataStore.collection);
        }, function (error) { _this._errors.next(error); completion.error(error); });
        return completion;
    };
    LocalCollectionService.prototype.recordHistory = function (action) {
        if (this.historyStore.length >= 100) {
            this.historyStore.shift();
        }
        this.historyStore.push({ action: action, state: this.dataStore });
        this._history.next(this.historyStore);
    };
    LocalCollectionService.prototype.removeCollectionItems = function (ids) {
        this.dataStore = Object.assign({}, this.dataStore, {
            collection: this.dataStore.collection.filter(function (item) { return !ids.find(function (id) { return id === item.id; }); })
        });
    };
    LocalCollectionService.prototype.assignIds = function (items) {
        var _this = this;
        items.forEach(function (i) { return i.id = _this.getGuid(); });
    };
    LocalCollectionService.prototype.getGuid = function () {
        return "" + this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
    };
    LocalCollectionService.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return LocalCollectionService;
}());
exports.LocalCollectionService = LocalCollectionService;
//# sourceMappingURL=local.service.js.map