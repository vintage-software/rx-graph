"use strict";
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/combineLatest");
require("rxjs/add/observable/merge");
require("rxjs/add/operator/share");
var utilities_1 = require("../utilities");
var BaseGraphService = (function () {
    function BaseGraphService(serviceConfigs) {
        var _this = this;
        this.serviceConfigs = serviceConfigs;
        var graph = new BehaviorSubject_1.BehaviorSubject(null);
        var history = new BehaviorSubject_1.BehaviorSubject({ state: null, action: 'INIT_GRAPH' });
        Observable_1.Observable
            .combineLatest(this.serviceConfigs.map(function (i) { return i.service._collection; }))
            .map(function (i) { return _this.slimifyCollection(i).map(function (array) { return utilities_1.deepClone(array); }); }).map(function (i) { return _this.toGraph(i); })
            .subscribe(function (g) { return graph.next(g); });
        this.graph = graph;
        Observable_1.Observable.combineLatest(Observable_1.Observable.merge.apply(Observable_1.Observable, this.serviceConfigs.map(function (i) { return (i.service).history; })), function (h) {
            return { state: graph.value, action: h[h.length - 1].action };
        }).subscribe(function (h) { return history.next(h); });
        this.history = history;
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