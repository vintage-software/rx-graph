"use strict";
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/observable/combineLatest');
var utilities_1 = require('../utilities');
var BaseGraphService = (function () {
    function BaseGraphService(serviceConfigs) {
        var _this = this;
        this.serviceConfigs = serviceConfigs;
        this.debug = false;
        var bs = new BehaviorSubject_1.BehaviorSubject(null);
        Observable_1.Observable
            .combineLatest(this.serviceConfigs.map(function (i) { return i.service._collection; }))
            .map(function (i) { return _this.slimifyCollection(i); })
            .subscribe(function (i) { return bs.next(i); });
        this.graph = bs.map(function (i) { return i.map(function (array) { return utilities_1.clone(array); }); }).map(function (i) { return _this.toGraph(i); });
    }
    BaseGraphService.prototype.slimifyCollection = function (collection) {
        var _this = this;
        var changes = true;
        while (changes === true) {
            changes = false;
            this.serviceConfigs.forEach(function (serviceConfig, index) {
                serviceConfig.relations.forEach(function (relation) {
                    return collection[index].forEach(function (collectionItem) {
                        var mappingService = _this.serviceConfigs.find(function (i) { return i.service === relation.to; });
                        var mappingIndex = _this.serviceConfigs.indexOf(mappingService);
                        var collectionItemsToUpdate = [];
                        if (_this.collectionItemHasRelation(collectionItem, relation)) {
                            changes = true;
                            if (relation.many) {
                                collectionItemsToUpdate = collectionItem[relation.collectionProperty];
                            }
                            else {
                                collectionItemsToUpdate.push(collectionItem[relation.collectionProperty]);
                            }
                            collectionItem[relation.collectionProperty] = null;
                            utilities_1.mergeCollection(collection[mappingIndex], collectionItemsToUpdate);
                            collection[mappingIndex] = collection[mappingIndex].filter(function (i) {
                                return i[relation.relationId] !== collectionItem.id || collectionItemsToUpdate.find(function (j) { return j.id === i.id; });
                            });
                        }
                    });
                });
            });
        }
        return collection;
    };
    BaseGraphService.prototype.collectionItemHasRelation = function (collectionItem, relation) {
        return !!collectionItem[relation.collectionProperty];
    };
    BaseGraphService.prototype.toGraph = function (collection) {
        var _this = this;
        var graph = {};
        this.serviceConfigs.forEach(function (serviceConfig, index) {
            serviceConfig.relations.forEach(function (relation) {
                return collection[index].forEach(function (collectionItem) {
                    _this.mapCollectionItemPropertyFromRelation(collectionItem, collection, relation);
                });
            });
            serviceConfig.func(graph, collection[index]);
        });
        return graph;
    };
    BaseGraphService.prototype.mapCollectionItemPropertyFromRelation = function (collectionItem, collection, relation) {
        var mappingService = this.serviceConfigs.find(function (i) { return i.service === relation.to; });
        var mappingIndex = this.serviceConfigs.indexOf(mappingService);
        if (relation.many) {
            collectionItem[relation.collectionProperty] = collection[mappingIndex].filter(function (i) { return i[relation.relationId] === collectionItem.id; });
        }
        else {
            collectionItem[relation.collectionProperty] = collection[mappingIndex].find(function (i) { return i.id === collectionItem[relation.relationId]; });
        }
    };
    return BaseGraphService;
}());
exports.BaseGraphService = BaseGraphService;
//# sourceMappingURL=base-graph.service.js.map