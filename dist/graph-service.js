"use strict";
var BehaviorSubject_1 = require('rxjs/subject/BehaviorSubject');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/combineLatest');
var GraphService = (function () {
    function GraphService(_serviceConfigs) {
        this._serviceConfigs = _serviceConfigs;
        this._debug = true;
        Observable_1.Observable.create();
        this._master$ = new BehaviorSubject_1.BehaviorSubject(this._serviceConfigs.map(function (i) { return []; }));
        var obs$ = this._serviceConfigs[0].service.collection$;
        if (this._serviceConfigs.length > 1) {
            obs$ = obs$.combineLatest(this._serviceConfigs.slice(1).map(function (i) { return i.service.collection$; }));
        }
        this._slimify(obs$).subscribe(this._master$);
    }
    Object.defineProperty(GraphService.prototype, "graph$", {
        get: function () {
            return this._toGraph(this._copy(this._master$));
        },
        enumerable: true,
        configurable: true
    });
    GraphService.prototype._slimify = function (masterObs) {
        var _this = this;
        return masterObs.map(function (master) {
            var arr = [];
            var changes = true;
            while (changes === true) {
                changes = false;
                _this._serviceConfigs.forEach(function (serviceConfig, index) {
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
            arr.forEach(function (value, index) { return value && _this._serviceConfigs[index].service.updateCollection(value); });
            _this._debug && console.log('master', master);
            return master;
        });
    };
    GraphService.prototype._combine = function (arr1, arr2) {
        var arr = arr1.slice();
        arr2.forEach(function (i) {
            if (arr.find(function (j) { return j.id === i.id; }) === undefined) {
                arr.push(i);
            }
        });
        return arr;
    };
    GraphService.prototype._copy = function (masterObs) {
        return masterObs.map(function (i) { return i.map(function (j) { return j.map(function (k) { return Object.assign({}, k); }); }); });
    };
    GraphService.prototype._toGraph = function (masterObs) {
        var _this = this;
        return masterObs.map(function (master) {
            var graph = {};
            _this._serviceConfigs.forEach(function (serviceConfig, index) {
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
        });
    };
    return GraphService;
}());
exports.GraphService = GraphService;
//# sourceMappingURL=graph-service.js.map