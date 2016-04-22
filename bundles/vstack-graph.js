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
System.register("rest-collection", ['angular2/core', 'rxjs/Subject', 'rxjs/subject/BehaviorSubject', 'rxjs/add/operator/map', "utilities"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_1, Subject_1, BehaviorSubject_1, utilities_1;
    var RestCollection;
    return {
        setters:[
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
                    var completion$ = new Subject_1.Subject();
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
                    var completion$ = new Subject_1.Subject();
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
                    var completion$ = new Subject_1.Subject();
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
                    var completion$ = new Subject_1.Subject();
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
                    var completion$ = new Subject_1.Subject();
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
                RestCollection = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Object])
                ], RestCollection);
                return RestCollection;
            }());
            exports_2("RestCollection", RestCollection);
        }
    }
});
System.register("graph-helpers", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
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
            exports_3("Mapping", Mapping);
            ServiceConfig = (function () {
                function ServiceConfig(service, func, mappings) {
                    this.service = service;
                    this.func = func;
                    this.mappings = mappings;
                }
                return ServiceConfig;
            }());
            exports_3("ServiceConfig", ServiceConfig);
        }
    }
});
System.register("graph-service", ['rxjs/Observable', 'rxjs/add/operator/combineLatest', 'rxjs/add/operator/startWith', 'rxjs/Rx', "utilities"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("GraphService", GraphService);
        }
    }
});
System.register("graph-service.spec", ['angular2/testing', 'angular2/http', 'angular2/core', 'angular2/http/testing', 'rxjs/Observable', "rest-collection", "graph-service", "graph-helpers"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var testing_1, http_1, core_2, testing_2, Observable_2, rest_collection_1, graph_service_1, graph_helpers_1;
    var TestUserService, TestItemService, TestGraphService, TestGraph;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (testing_2_1) {
                testing_2 = testing_2_1;
            },
            function (Observable_2_1) {
                Observable_2 = Observable_2_1;
            },
            function (rest_collection_1_1) {
                rest_collection_1 = rest_collection_1_1;
            },
            function (graph_service_1_1) {
                graph_service_1 = graph_service_1_1;
            },
            function (graph_helpers_1_1) {
                graph_helpers_1 = graph_helpers_1_1;
            }],
        execute: function() {
            TestUserService = (function (_super) {
                __extends(TestUserService, _super);
                function TestUserService(http) {
                    _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
                }
                TestUserService = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], TestUserService);
                return TestUserService;
            }(rest_collection_1.RestCollection));
            TestItemService = (function (_super) {
                __extends(TestItemService, _super);
                function TestItemService(http) {
                    _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
                }
                TestItemService = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], TestItemService);
                return TestItemService;
            }(rest_collection_1.RestCollection));
            TestGraphService = (function (_super) {
                __extends(TestGraphService, _super);
                function TestGraphService(testUserService, testItemService) {
                    _super.call(this, [
                        new graph_helpers_1.ServiceConfig(testUserService, function (graph, collection) { return graph.testUsers = collection; }, []),
                        new graph_helpers_1.ServiceConfig(testItemService, function (graph, collection) { return graph.testItems = collection; }, [])
                    ]);
                }
                TestGraphService = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [TestUserService, TestItemService])
                ], TestGraphService);
                return TestGraphService;
            }(graph_service_1.GraphService));
            TestGraph = (function () {
                function TestGraph() {
                }
                return TestGraph;
            }());
            testing_1.describe('GraphService Specs', function () {
                testing_1.beforeEachProviders(function () {
                    return [
                        http_1.HTTP_PROVIDERS,
                        testing_2.MockBackend,
                        http_1.BaseRequestOptions,
                        TestUserService,
                        TestItemService,
                        TestGraphService,
                        core_2.provide(http_1.Http, {
                            useFactory: function (backend, defaultOptions) { return new http_1.Http(backend, defaultOptions); },
                            deps: [testing_2.MockBackend, http_1.BaseRequestOptions]
                        })
                    ];
                });
                testing_1.it('tests a dummy Observable', testing_1.injectAsync([], function () {
                    return Observable_2.Observable.of(5).delay(500).toPromise()
                        .then(function (val) { testing_1.expect(val).toEqual(5); });
                }));
                testing_1.it('should be empty graph', testing_1.injectAsync([TestGraphService], function (graphService) {
                    return new Promise(function (resolve) {
                        graphService.graph$
                            .do(function (graph) { return testing_1.expect(graph.testItems.length).toBe(0); })
                            .do(function (graph) { return resolve(); })
                            .subscribe();
                    });
                }));
                testing_1.it('should be populated graph', testing_1.injectAsync([testing_2.MockBackend, TestItemService, TestGraphService], function (mockBackend, testItemService, graphService) {
                    setupMockBackend(mockBackend, [
                        { id: 1, value: 'value 1' },
                        { id: 2, value: 'value 2' },
                        { id: 3, value: 'value 3' }
                    ]);
                    return new Promise(function (resolve) {
                        graphService.graph$
                            .skip(1)
                            .do(function (graph) { return testing_1.expect(graph.testItems.length).toBe(3); })
                            .do(function (graph) { return resolve(); })
                            .subscribe();
                        testItemService.loadAll();
                    });
                }));
                testing_1.it('should have items on user', testing_1.injectAsync([testing_2.MockBackend, TestItemService, TestGraphService], function (mockBackend, testItemService, graphService) {
                    setupMockBackend(mockBackend, [
                        { id: 1, value: 'value 1' },
                        { id: 2, value: 'value 2' },
                        { id: 3, value: 'value 3' }
                    ]);
                    return new Promise(function (resolve) {
                        graphService.graph$
                            .skip(1)
                            .do(function (graph) { return testing_1.expect(graph.testItems.length).toBe(3); })
                            .do(function (graph) { return resolve(); })
                            .subscribe();
                        testItemService.loadAll();
                    });
                }));
                function setupMockBackend(mockBackend, body) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                            body: body
                        })));
                    });
                }
            });
        }
    }
});
System.register("rest-collection.spec", ['angular2/testing', 'angular2/http', 'angular2/core', 'angular2/http/testing', "rest-collection"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var testing_3, http_2, core_3, testing_4, rest_collection_2;
    var MockItemService;
    return {
        setters:[
            function (testing_3_1) {
                testing_3 = testing_3_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (testing_4_1) {
                testing_4 = testing_4_1;
            },
            function (rest_collection_2_1) {
                rest_collection_2 = rest_collection_2_1;
            }],
        execute: function() {
            MockItemService = (function (_super) {
                __extends(MockItemService, _super);
                function MockItemService(http) {
                    _super.call(this, { baseUrl: 'http://56e05c3213da80110013eba3.mockapi.io/api/items', options: {}, http: http });
                }
                MockItemService = __decorate([
                    core_3.Injectable(), 
                    __metadata('design:paramtypes', [http_2.Http])
                ], MockItemService);
                return MockItemService;
            }(rest_collection_2.RestCollection));
            testing_3.describe('RestCollection Specs', function () {
                testing_3.beforeEachProviders(function () {
                    return [
                        http_2.HTTP_PROVIDERS,
                        testing_4.MockBackend,
                        http_2.BaseRequestOptions,
                        MockItemService,
                        core_3.provide(http_2.Http, {
                            useFactory: function (backend, defaultOptions) { return new http_2.Http(backend, defaultOptions); },
                            deps: [testing_4.MockBackend, http_2.BaseRequestOptions]
                        })
                    ];
                });
                testing_3.it('should load a list of items', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({
                            body: [
                                { id: 1, value: 'value 1' },
                                { id: 2, value: 'value 2' },
                                { id: 3, value: 'value 3' }
                            ]
                        })));
                    });
                    return new Promise(function (resolve) {
                        mockItemService.collection$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (items) { return testing_3.expect(items.length).toBe(3); })
                            .subscribe();
                        mockItemService.loadAll();
                    });
                }));
                testing_3.it('should handle loading a list of items failure', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    return new Promise(function (resolve) {
                        mockItemService.errors$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (err) { return testing_3.expect(err).toBeDefined(); })
                            .subscribe();
                        mockItemService.loadAll();
                    });
                }));
                testing_3.it('should load a single item', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
                    });
                    return new Promise(function (resolve) {
                        mockItemService.collection$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (items) { return testing_3.expect(items[1].id).toBe(1); })
                            .subscribe();
                        mockItemService.load(1);
                    });
                }));
                testing_3.it('should handle loading a item failure', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    return new Promise(function (resolve) {
                        mockItemService.errors$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (err) { return testing_3.expect(err).toBeDefined(); })
                            .subscribe();
                        mockItemService.load(1);
                    });
                }));
                testing_3.it('should create a item', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
                    });
                    return new Promise(function (resolve) {
                        mockItemService.collection$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (items) { return testing_3.expect(items[1].value).toBe('value 1'); })
                            .subscribe();
                        mockItemService.create({ value: 'value 1' });
                    });
                }));
                testing_3.it('should handle creating a item failure', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    return new Promise(function (resolve) {
                        mockItemService.errors$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (err) { return testing_3.expect(err).toBeDefined(); })
                            .subscribe();
                        mockItemService.create({});
                    });
                }));
                testing_3.it('should update a item', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 2' } })));
                    });
                    return new Promise(function (resolve) {
                        mockItemService.collection$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (items) { return testing_3.expect(items[0].value).toBe('value 2'); })
                            .subscribe();
                        mockItemService.update({ id: 1, value: 'value 2' });
                    });
                }));
                testing_3.it('should handle updating a item failure', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    return new Promise(function (resolve) {
                        mockItemService.errors$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (err) { return testing_3.expect(err).toBeDefined(); })
                            .subscribe();
                        mockItemService.update({ id: 1 });
                    });
                }));
                testing_3.it('should remove a item', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
                    });
                    return new Promise(function (resolve) {
                        mockItemService.collection$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (items) { return testing_3.expect(items.length).toBe(0); })
                            .subscribe();
                        mockItemService.remove(1);
                    });
                }));
                testing_3.it('should handle removing a item failure', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
                    return new Promise(function (resolve) {
                        mockItemService.errors$
                            .skip(1)
                            .do(function () { return resolve(); })
                            .do(function (err) { return testing_3.expect(err).toBeDefined(); })
                            .subscribe();
                        mockItemService.remove(1);
                    });
                }));
                testing_3.it('should allow a subscription of errors', testing_3.injectAsync([testing_4.MockBackend, MockItemService], function (mockBackend, mockItemService) {
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' }, status: 404 })));
                    });
                    return new Promise(function (resolve) {
                        mockItemService.errors$
                            .do(function () { return resolve(); })
                            .do(function (err) { return testing_3.expect(err).toBeDefined(); })
                            .subscribe();
                        mockItemService.remove(1);
                    });
                }));
            });
        }
    }
});
System.register("utilities.spec", ['angular2/testing', "utilities"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var testing_5, utilities_3;
    return {
        setters:[
            function (testing_5_1) {
                testing_5 = testing_5_1;
            },
            function (utilities_3_1) {
                utilities_3 = utilities_3_1;
            }],
        execute: function() {
            testing_5.describe('Utilities Specs', function () {
                testing_5.it('should detect primitives', function () {
                    testing_5.expect(utilities_3.isPrimitive('Hello World')).toBe(true);
                    testing_5.expect(utilities_3.isPrimitive(true)).toBe(true);
                    testing_5.expect(utilities_3.isPrimitive(42)).toBe(true);
                    testing_5.expect(utilities_3.isPrimitive(null)).toBe(true);
                    testing_5.expect(utilities_3.isPrimitive(undefined)).toBe(true);
                    testing_5.expect(utilities_3.isPrimitive(new Date())).toBe(true);
                    testing_5.expect(utilities_3.isPrimitive({})).toBe(false);
                    testing_5.expect(utilities_3.isPrimitive([])).toBe(false);
                });
                testing_5.it('should be able to slimify objects', function () {
                    var complexObject = {
                        id: 1,
                        name: 'John Doe',
                        includedAccounts: ['Visa', 'Mastercard', 'Discover'],
                        includedSession: { token: '1234' }
                    };
                    testing_5.expect(utilities_3.slimify(complexObject).includedAccounts).toBe(null);
                    testing_5.expect(utilities_3.slimify(complexObject).includedSession).toBe(null);
                });
                testing_5.it('should be able to clone Dates, Objects and Arrays', function () {
                    var testDate = new Date();
                    var testObject = { id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] };
                    var testArray = [{ id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] }, { id: 2, utcDate: new Date(), accounts: ['Visa', 'Discover'] }];
                    testing_5.expect(utilities_3.clone(testDate).getTime()).toBe(testDate.getTime());
                    testing_5.expect(utilities_3.clone(testObject).id).toBe(1);
                    testing_5.expect(utilities_3.clone(testObject).utcDate.getTime()).toBe(testObject.utcDate.getTime());
                    testing_5.expect(utilities_3.clone(testObject).accounts[0]).toBe('Visa');
                    testing_5.expect(utilities_3.clone(testArray).length).toBe(2);
                });
            });
        }
    }
});
//# sourceMappingURL=vstack-graph.js.map