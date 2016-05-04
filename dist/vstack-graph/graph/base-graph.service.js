"use strict";
var Observable_1 = require('rxjs/Observable');
require('rxjs/Rx');
var utilities_1 = require('../utilities');
var BaseGraphService = (function () {
    function BaseGraphService(_serviceConfigs) {
        var _this = this;
        this._serviceConfigs = _serviceConfigs;
        this._debug = false;
        this.graph$ = Observable_1.Observable
            .combineLatest(this._serviceConfigs.map(function (i) { return i.service._collection$; }))
            .map(function (i) { return _this._slimifyCollection(i); })
            .share()
            .map(function (i) { return i.map(function (array) { return utilities_1.clone(array); }); })
            .map(function (i) { return _this._toGraph(i); });
    }
    BaseGraphService.prototype._slimifyCollection = function (collection) {
        var _this = this;
        var changes = true;
        while (changes === true) {
            changes = false;
            this._serviceConfigs.forEach(function (serviceConfig, index) {
                serviceConfig.relations.forEach(function (relation) {
                    return collection[index].forEach(function (collectionItem) {
                        var mappingService = _this._serviceConfigs.find(function (i) { return i.service === relation.to; });
                        var mappingIndex = _this._serviceConfigs.indexOf(mappingService);
                        var collectionItemsToUpdate = [];
                        if (!!collectionItem[relation.collectionProperty]) {
                            changes = true;
                            if (relation.many) {
                                collectionItemsToUpdate = collectionItem[relation.collectionProperty];
                            }
                            else {
                                collectionItemsToUpdate.push(collectionItem[relation.collectionProperty]);
                            }
                            collectionItem[relation.collectionProperty] = null;
                            utilities_1.mergeCollection(collection[mappingIndex], collectionItemsToUpdate);
                            collection[mappingIndex] = collection[mappingIndex].filter(function (i) { return i[relation.relationId] !== collectionItem.id || collectionItemsToUpdate.find(function (j) { return j.id === i.id; }); });
                        }
                    });
                });
            });
        }
        this._debug && console.log('Collection: ', collection);
        return collection;
    };
    BaseGraphService.prototype._toGraph = function (collection) {
        var _this = this;
        var graph = {};
        this._serviceConfigs.forEach(function (serviceConfig, index) {
            serviceConfig.relations.forEach(function (relation) {
                return collection[index].forEach(function (collectionItem) {
                    var mappingService = _this._serviceConfigs.find(function (i) { return i.service === relation.to; });
                    var mappingIndex = _this._serviceConfigs.indexOf(mappingService);
                    if (relation.many) {
                        collectionItem[relation.collectionProperty] = collection[mappingIndex].filter(function (i) { return i[relation.relationId] === collectionItem.id; });
                    }
                    else {
                        collectionItem[relation.collectionProperty] = collection[mappingIndex].find(function (i) { return i.id === collectionItem[relation.relationId]; });
                    }
                });
            });
            serviceConfig.func(graph, collection[index]);
        });
        return graph;
    };
    return BaseGraphService;
}());
exports.BaseGraphService = BaseGraphService;
//# sourceMappingURL=base-graph.service.js.map