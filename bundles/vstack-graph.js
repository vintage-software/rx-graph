System.register("utilities", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function clone(obj) {
        var copy;
        if (null === obj || 'object' !== typeof obj) {
            return obj;
        }
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        throw new Error('Unable to copy');
    }
    exports_1("clone", clone);
    function mergeCollection(target, src) {
        src.forEach(function (srcItem) {
            var match = target.find(function (tItem) { return tItem.id === srcItem.id; });
            if (match) {
                Object.assign(match, srcItem);
            }
            else {
                target.push(srcItem);
            }
        });
    }
    exports_1("mergeCollection", mergeCollection);
    function slimify(item) {
        var newItem = {};
        for (var prop in item) {
            if (isPrimitive(item[prop])) {
                newItem[prop] = item[prop];
            }
            else {
                newItem[prop] = null;
            }
        }
        return newItem;
    }
    exports_1("slimify", slimify);
    function isPrimitive(item) {
        return Object.prototype.toString.call(item) === '[object Date]' || typeof item !== 'object' || item === null;
    }
    exports_1("isPrimitive", isPrimitive);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("interfaces/http", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var ResponseType;
    return {
        setters:[],
        execute: function() {
            (function (ResponseType) {
                ResponseType[ResponseType["basic"] = 0] = "basic";
                ResponseType[ResponseType["cors"] = 1] = "cors";
                ResponseType[ResponseType["default"] = 2] = "default";
                ResponseType[ResponseType["error"] = 3] = "error";
                ResponseType[ResponseType["opaque"] = 4] = "opaque";
                ResponseType[ResponseType["opaqueredirect"] = 5] = "opaqueredirect";
            })(ResponseType || (ResponseType = {}));
            exports_2("ResponseType", ResponseType);
            ;
        }
    }
});
System.register("rest-collection", ['rxjs/subject/ReplaySubject', 'rxjs/subject/BehaviorSubject', 'rxjs/add/operator/map', "utilities"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var ReplaySubject_1, BehaviorSubject_1, utilities_1;
    var RestCollection;
    return {
        setters:[
            function (ReplaySubject_1_1) {
                ReplaySubject_1 = ReplaySubject_1_1;
            },
            function (BehaviorSubject_1_1) {
                BehaviorSubject_1 = BehaviorSubject_1_1;
            },
            function (_1) {},
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }],
        execute: function() {
            RestCollection = (function () {
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
            exports_3("RestCollection", RestCollection);
        }
    }
});
System.register("graph-helpers", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Mapping, ServiceConfig;
    return {
        setters:[],
        execute: function() {
            Mapping = (function () {
                function Mapping(collectionProperty, to, mappingId, many) {
                    this.collectionProperty = collectionProperty;
                    this.to = to;
                    this.mappingId = mappingId;
                    this.many = many;
                }
                return Mapping;
            }());
            exports_4("Mapping", Mapping);
            ServiceConfig = (function () {
                function ServiceConfig(service, func, mappings) {
                    this.service = service;
                    this.func = func;
                    this.mappings = mappings;
                }
                return ServiceConfig;
            }());
            exports_4("ServiceConfig", ServiceConfig);
        }
    }
});
System.register("graph-service", ['rxjs/Observable', 'rxjs/add/operator/combineLatest', 'rxjs/add/operator/startWith', 'rxjs/add/operator/skip', 'rxjs/add/operator/do', 'rxjs/Rx', "utilities"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Observable_1, utilities_2;
    var GraphService;
    return {
        setters:[
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_2) {},
            function (_3) {},
            function (_4) {},
            function (_5) {},
            function (_6) {},
            function (utilities_2_1) {
                utilities_2 = utilities_2_1;
            }],
        execute: function() {
            GraphService = (function () {
                function GraphService(_serviceConfigs) {
                    var _this = this;
                    this._serviceConfigs = _serviceConfigs;
                    this._debug = false;
                    this.graph$ = Observable_1.Observable
                        .combineLatest(this._serviceConfigs.map(function (i) { return i.service.collection$; }))
                        .map(function (i) { return _this._slimify(i); })
                        .map(function (i) { return i.map(function (array) { return utilities_2.clone(array); }); })
                        .map(function (i) { return _this._toGraph(i); });
                }
                GraphService.prototype._slimify = function (master) {
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
                    return masterObs.map(function (arrays) { return utilities_2.clone(arrays); });
                };
                GraphService.prototype._toGraph = function (master) {
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
                return GraphService;
            }());
            exports_5("GraphService", GraphService);
        }
    }
});
System.register("main", [], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=vstack-graph.js.map