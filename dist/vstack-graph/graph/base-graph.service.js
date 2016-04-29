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
            .map(function (i) { return _this._slimify(i); })
            .share()
            .map(function (i) { return i.map(function (array) { return utilities_1.clone(array); }); })
            .map(function (i) { return _this._toGraph(i); });
    }
    BaseGraphService.prototype._slimify = function (master) {
        var _this = this;
        var changes = true;
        while (changes === true) {
            changes = false;
            this._serviceConfigs.forEach(function (serviceConfig, index) {
                serviceConfig.mappings.forEach(function (mapping) {
                    return master[index].forEach(function (dto) {
                        var mappingService = _this._serviceConfigs.find(function (i) { return i.service === mapping.to; });
                        var mappingIndex = _this._serviceConfigs.indexOf(mappingService);
                        var toUpdate = [];
                        if (!!dto[mapping.collectionProperty]) {
                            changes = true;
                            if (mapping.many) {
                                toUpdate = dto[mapping.collectionProperty];
                            }
                            else {
                                toUpdate.push(dto[mapping.collectionProperty]);
                            }
                            dto[mapping.collectionProperty] = null;
                            utilities_1.mergeCollection(master[mappingIndex], toUpdate);
                            master[mappingIndex] = master[mappingIndex].filter(function (i) { return i[mapping.mappingId] !== dto.id || toUpdate.find(function (j) { return j.id === i.id; }); });
                        }
                    });
                });
            });
        }
        this._debug && console.log('master', master);
        return master;
    };
    BaseGraphService.prototype._toGraph = function (master) {
        var _this = this;
        var graph = {};
        this._serviceConfigs.forEach(function (serviceConfig, index) {
            serviceConfig.mappings.forEach(function (mapping) {
                return master[index].forEach(function (dto) {
                    var mappingService = _this._serviceConfigs.find(function (i) { return i.service === mapping.to; });
                    var mappingIndex = _this._serviceConfigs.indexOf(mappingService);
                    if (mapping.many) {
                        dto[mapping.collectionProperty] = master[mappingIndex].filter(function (i) { return i[mapping.mappingId] === dto.id; });
                    }
                    else {
                        dto[mapping.collectionProperty] = master[mappingIndex].find(function (i) { return i.id === dto[mapping.mappingId]; });
                    }
                });
            });
            serviceConfig.func(graph, master[index]);
        });
        return graph;
    };
    return BaseGraphService;
}());
exports.BaseGraphService = BaseGraphService;
//# sourceMappingURL=base-graph.service.js.map