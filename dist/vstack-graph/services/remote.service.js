"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var local_service_1 = require("./local.service");
var utilities_1 = require("../utilities");
var vs_queryable_1 = require("./vs-queryable");
var BaseRemoteService = (function (_super) {
    __extends(BaseRemoteService, _super);
    function BaseRemoteService(remotePersistenceMapper) {
        var _this = _super.call(this, remotePersistenceMapper) || this;
        _this.remotePersistenceMapper = remotePersistenceMapper;
        return _this;
    }
    Object.defineProperty(BaseRemoteService.prototype, "_remoteMapper", {
        get: function () {
            return this._mapper;
        },
        enumerable: true,
        configurable: true
    });
    BaseRemoteService.prototype.inject = function (items) {
        var completion = new ReplaySubject_1.ReplaySubject(1);
        utilities_1.mergeCollection(this.store.collection, items);
        this.recordHistory('INJECT');
        completion.next(utilities_1.deepClone(items));
        completion.complete();
        this._collection.next(this.store.collection);
        return completion;
    };
    BaseRemoteService.prototype.load = function (id, options) {
        var _this = this;
        var completion = new ReplaySubject_1.ReplaySubject(1);
        this._remoteMapper.load(id, options).subscribe(function (item) {
            utilities_1.mergeCollection(_this.store.collection, [item]);
            _this.recordHistory('LOAD');
            completion.next(utilities_1.deepClone(item));
            completion.complete();
            _this._collection.next(_this.store.collection);
        }, function (error) { _this._errors.next(error); completion.error(error); });
        return completion;
    };
    BaseRemoteService.prototype.loadMany = function (isLoadAll, options) {
        var _this = this;
        var completion = new ReplaySubject_1.ReplaySubject(1);
        this._remoteMapper.loadMany(options).subscribe(function (items) {
            utilities_1.mergeCollection(_this.store.collection, items);
            if (isLoadAll) {
                _this.store.collection = _this.store.collection.filter(function (i) { return !!items.find(function (j) { return j.id === i.id; }); });
            }
            _this.recordHistory('LOAD_MANY');
            completion.next(utilities_1.deepClone(items));
            completion.complete();
            _this._collection.next(_this.store.collection);
        }, function (error) { _this._errors.next(error); completion.error(error); });
        return completion;
    };
    return BaseRemoteService;
}(local_service_1.LocalCollectionService));
exports.BaseRemoteService = BaseRemoteService;
var CollectionService = (function (_super) {
    __extends(CollectionService, _super);
    function CollectionService(remotePersistenceMapper) {
        return _super.call(this, remotePersistenceMapper) || this;
    }
    CollectionService.prototype.get = function (id, options) {
        return this.load(id, options);
    };
    CollectionService.prototype.getAll = function (options) {
        var isLoadAll = !!!options;
        return this.loadMany(isLoadAll, options);
    };
    return CollectionService;
}(BaseRemoteService));
exports.CollectionService = CollectionService;
var VSCollectionService = (function (_super) {
    __extends(VSCollectionService, _super);
    function VSCollectionService(remotePersistenceMapper) {
        return _super.call(this, remotePersistenceMapper) || this;
    }
    VSCollectionService.prototype.get = function (id) {
        var _this = this;
        return new vs_queryable_1.VsQueryable(function (isLoadAll, options) { return _this.load(id, options); });
    };
    VSCollectionService.prototype.getAll = function () {
        var _this = this;
        return new vs_queryable_1.VsQueryable(function (isLoadAll, options) { return _this.loadMany(isLoadAll, options); });
    };
    return VSCollectionService;
}(BaseRemoteService));
exports.VSCollectionService = VSCollectionService;
//# sourceMappingURL=remote.service.js.map