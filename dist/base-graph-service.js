"use strict";
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/combineLatest');
require('rxjs/add/operator/startWith');
require('rxjs/add/operator/skip');
require('rxjs/add/operator/do');
require('rxjs/Rx');
var utilities_1 = require('./utilities');
var BaseGraphService = (function () {
    function BaseGraphService(_serviceConfigs) {
        var _this = this;
        this._serviceConfigs = _serviceConfigs;
        this._debug = false;
        this.graph$ = Observable_1.Observable
            .combineLatest(this._serviceConfigs.map(function (i) { return i.service._collection$; }))
            .map(function (i) { return _this._slimify(i); })
            .map(function (i) { return i.map(function (array) { return utilities_1.clone(array); }); })
            .map(function (i) { return _this._toGraph(i); });
    }
    BaseGraphService.prototype._slimify = function (master) {
        var _this = this;
        var arr = [];
        var changes = true;
        while (changes === true) {
            changes = false;
            this._serviceConfigs.forEach(function (serviceConfig, index) {
                serviceConfig.mappings.forEach(function (mapping) {
                    return master[index].forEach(function (dto) {
                        var mappingService = _this._serviceConfigs.find(function (i) { return i.service === mapping.to; });
                        var mappingIndex = _this._serviceConfigs.indexOf(mappingService);
                        var toUpdate = [];
                        if (dto[mapping.collectionProperty] !== null) {
                            changes = true;
                            if (mapping.many) {
                                toUpdate = dto[mapping.collectionProperty] || [];
                            }
                            else {
                                toUpdate.push(dto[mapping.collectionProperty]);
                            }
                            dto[mapping.collectionProperty] = null;
                            arr[mappingIndex] = arr[mappingIndex] ? arr[mappingIndex].concat(toUpdate) : toUpdate;
                            master[mappingIndex] = _this._combine(master[mappingIndex], toUpdate);
                        }
                    });
                });
            });
        }
        this._debug && console.log('master', master);
        return master;
    };
    BaseGraphService.prototype._combine = function (arr1, arr2) {
        var arr = arr1.slice();
        arr2.forEach(function (i) {
            if (arr.find(function (j) { return j.id === i.id; }) === undefined) {
                arr.push(i);
            }
        });
        return arr;
    };
    BaseGraphService.prototype._copy = function (masterObs) {
        return masterObs.map(function (arrays) { return utilities_1.clone(arrays); });
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
//# sourceMappingURL=base-graph-service.js.map