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
System.register("testing/mock-http", ['rxjs/Observable'], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Observable_2;
    var MockHttp;
    return {
        setters:[
            function (Observable_2_1) {
                Observable_2 = Observable_2_1;
            }],
        execute: function() {
            MockHttp = (function () {
                function MockHttp(_mockResponse) {
                    this._mockResponse = _mockResponse;
                }
                MockHttp.prototype.get = function (url, options) {
                    if (options === void 0) { options = ''; }
                    return Observable_2.Observable.of(this._mockResponse);
                };
                MockHttp.prototype.post = function (url, body, options) {
                    if (options === void 0) { options = ''; }
                    return Observable_2.Observable.of(this._mockResponse);
                };
                MockHttp.prototype.put = function (url, body, options) {
                    if (options === void 0) { options = ''; }
                    return Observable_2.Observable.of(this._mockResponse);
                };
                MockHttp.prototype.delete = function (url, options) {
                    if (options === void 0) { options = ''; }
                    return Observable_2.Observable.of(this._mockResponse);
                };
                MockHttp.prototype.setMockResponse = function (response) {
                    this._mockResponse = response;
                };
                return MockHttp;
            }());
            exports_6("MockHttp", MockHttp);
        }
    }
});
System.register("graph-service.spec", ['angular2/testing', 'angular2/http', 'rxjs/Observable', "rest-collection", "graph-service", "graph-helpers", "testing/mock-http"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var testing_1, http_1, Observable_3, rest_collection_1, graph_service_1, graph_helpers_1, mock_http_1;
    var TestUserService, TestItemService, TestGraphService, TestGraph;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_3_1) {
                Observable_3 = Observable_3_1;
            },
            function (rest_collection_1_1) {
                rest_collection_1 = rest_collection_1_1;
            },
            function (graph_service_1_1) {
                graph_service_1 = graph_service_1_1;
            },
            function (graph_helpers_1_1) {
                graph_helpers_1 = graph_helpers_1_1;
            },
            function (mock_http_1_1) {
                mock_http_1 = mock_http_1_1;
            }],
        execute: function() {
            TestUserService = (function (_super) {
                __extends(TestUserService, _super);
                function TestUserService(http) {
                    _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
                }
                return TestUserService;
            }(rest_collection_1.RestCollection));
            TestItemService = (function (_super) {
                __extends(TestItemService, _super);
                function TestItemService(http) {
                    _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
                }
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
                return TestGraphService;
            }(graph_service_1.GraphService));
            TestGraph = (function () {
                function TestGraph() {
                }
                return TestGraph;
            }());
            testing_1.describe('GraphService Specs', function () {
                var testGraphService, testUserService, testItemService, mockHttp;
                testing_1.beforeEach(function () {
                    mockHttp = new mock_http_1.MockHttp({});
                    testUserService = new TestUserService(mockHttp);
                    testItemService = new TestItemService(mockHttp);
                    testGraphService = new TestGraphService(testUserService, testItemService);
                });
                testing_1.it('tests a dummy Observable', function () {
                    return Observable_3.Observable.of(5).delay(500).toPromise()
                        .then(function (val) { testing_1.expect(val).toEqual(5); });
                });
                testing_1.it('should be empty graph', function () {
                    testGraphService.graph$
                        .do(function (graph) { return testing_1.expect(graph.testItems.length).toBe(0); })
                        .subscribe();
                });
                testing_1.it('should be populated graph', function () {
                    mockHttp.setMockResponse(new http_1.Response(new http_1.ResponseOptions({
                        body: [
                            { id: 1, value: 'user 1' },
                            { id: 2, value: 'user 2' },
                            { id: 3, value: 'user 3' }
                        ]
                    })));
                    testGraphService.graph$
                        .skip(1)
                        .do(function (graph) { return testing_1.expect(graph.testItems.length).toBe(3); })
                        .subscribe();
                    testItemService.loadAll();
                });
                testing_1.it('should have items on user', function () {
                    testGraphService.graph$
                        .skip(2)
                        .do(function (graph) {
                        testing_1.expect(graph.testUsers.length).toBe(3);
                        testing_1.expect(graph.testItems.length).toBe(3);
                        graph.testItems.map(function (i) { return testing_1.expect(!!i.testUser).toBe(false); });
                    })
                        .subscribe();
                    mockHttp.setMockResponse(new http_1.Response(new http_1.ResponseOptions({
                        body: [
                            { id: 1, value: 'user 1' },
                            { id: 2, value: 'user 2' },
                            { id: 3, value: 'user 3' }
                        ]
                    })));
                    testUserService.loadAll();
                    mockHttp.setMockResponse(new http_1.Response(new http_1.ResponseOptions({
                        body: [
                            { id: 1, value: 'item 1' },
                            { id: 2, value: 'item 2' },
                            { id: 3, value: 'item 3' }
                        ]
                    })));
                    testItemService.loadAll();
                });
            });
        }
    }
});
System.register("rest-collection.spec", ['angular2/testing', 'angular2/http', "rest-collection", "testing/mock-http"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var testing_2, http_2, rest_collection_2, mock_http_2;
    var MockCollectionService;
    return {
        setters:[
            function (testing_2_1) {
                testing_2 = testing_2_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (rest_collection_2_1) {
                rest_collection_2 = rest_collection_2_1;
            },
            function (mock_http_2_1) {
                mock_http_2 = mock_http_2_1;
            }],
        execute: function() {
            MockCollectionService = (function (_super) {
                __extends(MockCollectionService, _super);
                function MockCollectionService(http) {
                    _super.call(this, { baseUrl: 'http://56e05c3213da80110013eba3.mockapi.io/api/items', options: {}, http: http });
                }
                return MockCollectionService;
            }(rest_collection_2.RestCollection));
            testing_2.describe('RestCollection Specs New', function () {
                testing_2.it('should load a list of items', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({
                        body: [
                            { id: 1, value: 'value 1' },
                            { id: 2, value: 'value 2' },
                            { id: 3, value: 'value 3' }
                        ]
                    }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(response));
                    mockCollectionService.collection$
                        .skip(1)
                        .do(function (items) { return testing_2.expect(items.length).toBe(3); })
                        .subscribe();
                    mockCollectionService.loadAll();
                });
                testing_2.it('should handle loading a list of items failure', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ status: 404 }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(new Error('ERROR')));
                    mockCollectionService.errors$
                        .skip(1)
                        .do(function (err) { return testing_2.expect(err).toBeDefined(); })
                        .subscribe();
                    mockCollectionService.loadAll();
                });
                testing_2.it('should load a single item', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(response));
                    mockCollectionService.collection$
                        .skip(1)
                        .do(function (items) { return testing_2.expect(items[0].id).toBe(1); })
                        .subscribe();
                    mockCollectionService.load(1);
                });
                testing_2.it('should handle loading a item failure', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ status: 404 }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(new Error('ERROR')));
                    mockCollectionService.errors$
                        .skip(1)
                        .do(function (err) { return testing_2.expect(err).toBeDefined(); })
                        .subscribe();
                    mockCollectionService.load(1);
                });
                testing_2.it('should create a item', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 1' } }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(response));
                    mockCollectionService.collection$
                        .skip(1)
                        .do(function (items) { return testing_2.expect(items[0].id).toBe(1); })
                        .subscribe();
                    mockCollectionService.create({ value: 'value 1' });
                });
                testing_2.it('should handle creating a item failure', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ status: 404 }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(new Error('ERROR')));
                    mockCollectionService.errors$
                        .skip(1)
                        .do(function (err) { return testing_2.expect(err).toBeDefined(); })
                        .subscribe();
                    mockCollectionService.create({});
                });
                testing_2.it('should update a item', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ body: { id: 1, value: 'value 2' } }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(response));
                    mockCollectionService.collection$
                        .skip(1)
                        .do(function (items) { return testing_2.expect(items[0].value).toBe('value 2'); })
                        .subscribe();
                    mockCollectionService.update({ id: 1, value: 'value 2' });
                });
                testing_2.it('should handle updating a item failure', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ status: 404 }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(new Error('ERROR')));
                    mockCollectionService.errors$
                        .skip(1)
                        .do(function (err) { return testing_2.expect(err).toBeDefined(); })
                        .subscribe();
                    mockCollectionService.update({ id: 1 });
                });
                testing_2.it('should remove a item', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ body: null }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(response));
                    mockCollectionService.collection$
                        .skip(1)
                        .do(function (items) { return testing_2.expect(items.length).toBe(0); })
                        .subscribe();
                    mockCollectionService.remove(1);
                });
                testing_2.it('should handle removing a item failure', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({ status: 404 }));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(new Error('ERROR')));
                    mockCollectionService.errors$
                        .skip(1)
                        .do(function (err) { return testing_2.expect(err).toBeDefined(); })
                        .subscribe();
                    mockCollectionService.remove(1);
                });
                testing_2.it('should allow a subscription of errors', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({}));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(response));
                    mockCollectionService.errors$
                        .do(function (err) { return testing_2.expect(err).toBeDefined(); })
                        .subscribe();
                });
                testing_2.it('should allow a subscription of history', function () {
                    var response = new http_2.Response(new http_2.ResponseOptions({}));
                    var mockCollectionService = new MockCollectionService(new mock_http_2.MockHttp(response));
                    mockCollectionService.history$
                        .do(function (err) { return testing_2.expect(err).toBeDefined(); })
                        .subscribe();
                });
            });
        }
    }
});
System.register("utilities.spec", ['angular2/testing', "utilities"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var testing_3, utilities_3;
    return {
        setters:[
            function (testing_3_1) {
                testing_3 = testing_3_1;
            },
            function (utilities_3_1) {
                utilities_3 = utilities_3_1;
            }],
        execute: function() {
            testing_3.describe('Utilities Specs', function () {
                testing_3.it('should detect primitives', function () {
                    testing_3.expect(utilities_3.isPrimitive('Hello World')).toBe(true);
                    testing_3.expect(utilities_3.isPrimitive(true)).toBe(true);
                    testing_3.expect(utilities_3.isPrimitive(42)).toBe(true);
                    testing_3.expect(utilities_3.isPrimitive(null)).toBe(true);
                    testing_3.expect(utilities_3.isPrimitive(undefined)).toBe(true);
                    testing_3.expect(utilities_3.isPrimitive(new Date())).toBe(true);
                    testing_3.expect(utilities_3.isPrimitive({})).toBe(false);
                    testing_3.expect(utilities_3.isPrimitive([])).toBe(false);
                });
                testing_3.it('should be able to slimify objects', function () {
                    var complexObject = {
                        id: 1,
                        name: 'John Doe',
                        includedAccounts: ['Visa', 'Mastercard', 'Discover'],
                        includedSession: { token: '1234' }
                    };
                    testing_3.expect(utilities_3.slimify(complexObject).includedAccounts).toBe(null);
                    testing_3.expect(utilities_3.slimify(complexObject).includedSession).toBe(null);
                });
                testing_3.it('should be able to clone Dates, Objects and Arrays', function () {
                    var testDate = new Date();
                    var testObject = { id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] };
                    var testArray = [{ id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] }, { id: 2, utcDate: new Date(), accounts: ['Visa', 'Discover'] }];
                    testing_3.expect(utilities_3.clone(testDate).getTime()).toBe(testDate.getTime());
                    testing_3.expect(utilities_3.clone(testObject).id).toBe(1);
                    testing_3.expect(utilities_3.clone(testObject).utcDate.getTime()).toBe(testObject.utcDate.getTime());
                    testing_3.expect(utilities_3.clone(testObject).accounts[0]).toBe('Visa');
                    testing_3.expect(utilities_3.clone(testArray).length).toBe(2);
                });
            });
        }
    }
});
//# sourceMappingURL=vstack-graph.js.map