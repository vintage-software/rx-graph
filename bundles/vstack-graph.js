var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("rest-collection", ['angular2/http', 'angular2/core', 'rxjs/Subject', 'rxjs/subject/BehaviorSubject', 'rxjs/add/operator/map', "utilities"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var http_1, core_1, Subject_1, BehaviorSubject_1, utilities_1;
    var RestCollection;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
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
                function RestCollection(_baseUrl, _http) {
                    this._baseUrl = _baseUrl;
                    this._http = _http;
                    this._collection$ = new BehaviorSubject_1.BehaviorSubject([]);
                    this._errors$ = new BehaviorSubject_1.BehaviorSubject({});
                    this._history$ = new BehaviorSubject_1.BehaviorSubject({});
                    this._history$.subscribe();
                    this._dataStore = { collection: [] };
                    this._historyStore = [];
                    this._recordHistory('INIT');
                }
                Object.defineProperty(RestCollection.prototype, "collection$", {
                    get: function () {
                        return this._collection$;
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
                    var completion$ = new Subject_1.Subject();
                    this._apiGet(this._baseUrl + "?" + options).subscribe(function (data) {
                        _this._updateCollection(data);
                        _this._recordHistory('LOAD_ALL');
                        _this._collection$.next(_this._dataStore.collection);
                        completion$.next(data);
                        completion$.complete();
                    }, function (error) { _this._errors$.next(error); completion$.error(error); });
                    return completion$;
                };
                RestCollection.prototype.load = function (id, options) {
                    var _this = this;
                    if (options === void 0) { options = ''; }
                    var completion$ = new Subject_1.Subject();
                    this._apiGet(this._baseUrl + "/" + id + "?" + options).subscribe(function (data) {
                        _this._updateCollectionItem(data.id, data);
                        _this._recordHistory('LOAD');
                        _this._collection$.next(_this._dataStore.collection);
                        completion$.next(data);
                        completion$.complete();
                    }, function (error) { _this._errors$.next(error); completion$.error(error); });
                    return completion$;
                };
                RestCollection.prototype.create = function (item, options) {
                    var _this = this;
                    if (options === void 0) { options = ''; }
                    var completion$ = new Subject_1.Subject();
                    this._apiPost(this._baseUrl, utilities_1.slimify(item)).subscribe(function (data) {
                        _this._addCollectionItem(data);
                        _this._recordHistory('CREATE');
                        _this._collection$.next(_this._dataStore.collection);
                        completion$.next(data);
                        completion$.complete();
                    }, function (error) { _this._errors$.next(error); completion$.error(error); });
                    return completion$;
                };
                RestCollection.prototype.update = function (item) {
                    var _this = this;
                    var completion$ = new Subject_1.Subject();
                    this._apiPut(this._baseUrl + "/" + item.id, utilities_1.slimify(item)).subscribe(function (data) {
                        _this._updateCollectionItem(item.id, data);
                        _this._recordHistory('UPDATE');
                        _this._collection$.next(_this._dataStore.collection);
                        completion$.next(data);
                        completion$.complete();
                    }, function (error) { _this._errors$.next(error); completion$.error(error); });
                    return completion$;
                };
                RestCollection.prototype.remove = function (id) {
                    var _this = this;
                    var completion$ = new Subject_1.Subject();
                    this._apiDelete(this._baseUrl + "/" + id).subscribe(function (response) {
                        _this._removeCollectionItem(id);
                        _this._recordHistory('REMOVE');
                        _this._collection$.next(_this._dataStore.collection);
                        completion$.next(null);
                        completion$.complete();
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
                RestCollection.prototype._updateCollection = function (collection) {
                    this._dataStore = Object.assign({}, this._dataStore, { collection: collection });
                };
                RestCollection.prototype._addCollectionItem = function (item) {
                    this._dataStore = { collection: this._dataStore.collection.concat([item]) };
                };
                RestCollection.prototype._updateCollectionItem = function (id, data) {
                    var notFound = true;
                    this._dataStore = Object.assign({}, this._dataStore, {
                        collection: this._dataStore.collection.map(function (item, index) {
                            if (item.id === id) {
                                notFound = false;
                                return Object.assign({}, utilities_1.deepmerge(item, data));
                            }
                            return item;
                        })
                    });
                    if (notFound) {
                        this._dataStore = { collection: this._dataStore.collection.concat([data]) };
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
                RestCollection = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [String, http_1.Http])
                ], RestCollection);
                return RestCollection;
            }());
            exports_1("RestCollection", RestCollection);
        }
    }
});
System.register("utilities", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Mapping, ServiceConfig;
    function clone(obj) {
        var copy;
        if (null == obj || "object" != typeof obj)
            return obj;
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
    exports_2("clone", clone);
    function deepmerge(target, src) {
        var array = Array.isArray(src);
        var dst = array && [] || {};
        if (array) {
            target = target || [];
            dst = dst.concat(target);
            src.forEach(function (e, i) {
                if (typeof dst[i] === 'undefined') {
                    dst[i] = e;
                }
                else if (typeof e === 'object') {
                    dst[i] = deepmerge(target[i], e);
                }
                else {
                    if (target.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            });
        }
        else {
            if (target && typeof target === 'object') {
                Object.keys(target).forEach(function (key) {
                    dst[key] = target[key];
                });
            }
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    }
                    else {
                        dst[key] = deepmerge(target[key], src[key]);
                    }
                }
            });
        }
        return dst;
    }
    exports_2("deepmerge", deepmerge);
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
    exports_2("slimify", slimify);
    function isPrimitive(item) {
        return Object.prototype.toString.call(item) === '[object Date]'
            || typeof item !== 'object';
    }
    exports_2("isPrimitive", isPrimitive);
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
            exports_2("Mapping", Mapping);
            ServiceConfig = (function () {
                function ServiceConfig(service, func, mappings) {
                    this.service = service;
                    this.func = func;
                    this.mappings = mappings;
                }
                return ServiceConfig;
            }());
            exports_2("ServiceConfig", ServiceConfig);
        }
    }
});
System.register("graph-service", ['rxjs/subject/BehaviorSubject', 'rxjs/Observable', 'rxjs/add/operator/combineLatest'], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var BehaviorSubject_2, Observable_1;
    var GraphService;
    return {
        setters:[
            function (BehaviorSubject_2_1) {
                BehaviorSubject_2 = BehaviorSubject_2_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_2) {}],
        execute: function() {
            GraphService = (function () {
                function GraphService(_serviceConfigs) {
                    this._serviceConfigs = _serviceConfigs;
                    this._debug = true;
                    Observable_1.Observable.create();
                    this._master$ = new BehaviorSubject_2.BehaviorSubject(this._serviceConfigs.map(function (i) { return []; }));
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
                        arr.forEach(function (value, index) { return value && _this._serviceConfigs[index].service._dangerousGraphUpdateCollection(value); });
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
            exports_3("GraphService", GraphService);
        }
    }
});
System.register("rest-collection.spec", ['angular2/testing', 'angular2/http', 'angular2/core', 'angular2/http/testing', "rest-collection"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var testing_1, http_2, core_2, testing_2, rest_collection_1;
    var MockItemService;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (testing_2_1) {
                testing_2 = testing_2_1;
            },
            function (rest_collection_1_1) {
                rest_collection_1 = rest_collection_1_1;
            }],
        execute: function() {
            MockItemService = (function (_super) {
                __extends(MockItemService, _super);
                function MockItemService(http) {
                    _super.call(this, 'http://56e05c3213da80110013eba3.mockapi.io/api/items', http);
                }
                MockItemService = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [http_2.Http])
                ], MockItemService);
                return MockItemService;
            }(rest_collection_1.RestCollection));
            testing_1.describe('MyService Tests', function () {
                testing_1.beforeEachProviders(function () {
                    return [
                        http_2.HTTP_PROVIDERS,
                        testing_2.MockBackend,
                        http_2.BaseRequestOptions,
                        MockItemService,
                        core_2.provide(http_2.Http, {
                            useFactory: function (backend, defaultOptions) { return new http_2.Http(backend, defaultOptions); },
                            deps: [testing_2.MockBackend, http_2.BaseRequestOptions]
                        })
                    ];
                });
                testing_1.it('should load a list of items', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({
                            body: [
                                { id: 1, value: 'value 1' },
                                { id: 2, value: 'value 2' },
                                { id: 3, value: 'value 3' }
                            ]
                        })));
                    });
                    mockItemService.loadAll();
                    mockItemService.collection$.subscribe(function (items) { return testing_1.expect(items.length).toBe(3); });
                }));
                testing_1.it('should handle loading a list of items failure', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    mockItemService.loadAll();
                    mockItemService.errors$.subscribe(function (err) { return testing_1.expect(err).toBeDefined(); });
                }));
                testing_1.it('should load a single item', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
                    });
                    mockItemService.load(1);
                    mockItemService.collection$.subscribe(function (items) { return testing_1.expect(items.length).toBe(1); });
                }));
                testing_1.it('should handle loading a item failure', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    mockItemService.load(1);
                    mockItemService.errors$.subscribe(function (err) { return testing_1.expect(err).toBeDefined(); });
                }));
                testing_1.it('should create a item', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
                    });
                    mockItemService.create({ value: 'value 1' });
                    mockItemService.collection$.subscribe(function (items) { return testing_1.expect(items.length).toBe(1); });
                }));
                testing_1.it('should handle creating a item failure', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    mockItemService.create({});
                    mockItemService.errors$.subscribe(function (err) { return testing_1.expect(err).toBeDefined(); });
                }));
                testing_1.it('should update a item', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 2' } })));
                    });
                    mockItemService.update({ id: 1, value: 'value 2' });
                    mockItemService.collection$.subscribe(function (items) { return testing_1.expect(items[0].value).toBe('value 2'); });
                }));
                testing_1.it('should handle updating a item failure', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    mockItemService.update({ id: 1 });
                    mockItemService.errors$.subscribe(function (err) { return testing_1.expect(err).toBeDefined(); });
                }));
                testing_1.it('should remove a item', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
                    });
                    mockItemService.remove(1);
                    mockItemService.collection$.subscribe(function (items) { return testing_1.expect(items.length).toBe(0); });
                }));
                testing_1.it('should handle removing a item failure', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    mockItemService.remove(1);
                    mockItemService.errors$.subscribe(function (err) { return testing_1.expect(err).toBeDefined(); });
                }));
                testing_1.it('should allow a subscription of errors', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' }, status: 404 })));
                    });
                    mockItemService.errors$.subscribe(function (err) { return testing_1.expect(err).toBeDefined(); });
                }));
            });
        }
    }
});
//# sourceMappingURL=vstack-graph.js.map