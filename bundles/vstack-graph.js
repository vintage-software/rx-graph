var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("vstack-graph/utilities", [], function(exports_1, context_1) {
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
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = clone(obj[attr]);
                }
            }
            return copy;
        }
        throw new Error('Unable to copy');
    }
    exports_1("clone", clone);
    function mergeCollection(target, src) {
        src.filter(function (i) { return i && i.id; }).forEach(function (srcItem) {
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
System.register("vstack-graph/services/local.service", ['rxjs/BehaviorSubject', 'rxjs/Subject', 'rxjs/ReplaySubject', 'rxjs/add/operator/map', "vstack-graph/utilities"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var BehaviorSubject_1, Subject_1, ReplaySubject_1, utilities_1;
    var LocalCollectionService;
    return {
        setters:[
            function (BehaviorSubject_1_1) {
                BehaviorSubject_1 = BehaviorSubject_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (ReplaySubject_1_1) {
                ReplaySubject_1 = ReplaySubject_1_1;
            },
            function (_1) {},
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }],
        execute: function() {
            LocalCollectionService = (function () {
                function LocalCollectionService(_mapper) {
                    this._mapper = _mapper;
                    this._collection = new BehaviorSubject_1.BehaviorSubject([]);
                    this._errors = new Subject_1.Subject();
                    this._history = new Subject_1.Subject();
                    this.dataStore = { collection: [] };
                    this.historyStore = [];
                    this.recordHistory('INIT');
                }
                Object.defineProperty(LocalCollectionService.prototype, "collection", {
                    get: function () {
                        return this._collection.map(function (collection) { return utilities_1.clone(collection); });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LocalCollectionService.prototype, "errors", {
                    get: function () {
                        return this._errors.asObservable();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LocalCollectionService.prototype, "history", {
                    get: function () {
                        return this._history.asObservable();
                    },
                    enumerable: true,
                    configurable: true
                });
                LocalCollectionService.prototype.create = function (item) {
                    return this.createMany([item])
                        .map(function (items) { return items.find(function (i) { return true; }); });
                };
                LocalCollectionService.prototype.createMany = function (items) {
                    var _this = this;
                    var completion = new ReplaySubject_1.ReplaySubject(1);
                    this.assignIds(items);
                    this._mapper.create(items.map(function (i) { return utilities_1.slimify(i); })).subscribe(function (items) {
                        utilities_1.mergeCollection(_this.dataStore.collection, items);
                        _this.recordHistory('CREATE');
                        completion.next(utilities_1.clone(items));
                        completion.complete();
                        _this._collection.next(_this.dataStore.collection);
                    }, function (error) { _this._errors.next(error); completion.error(error); });
                    return completion;
                };
                LocalCollectionService.prototype.update = function (item) {
                    return this.updateMany([item])
                        .map(function (items) { return items.find(function (i) { return true; }); });
                };
                LocalCollectionService.prototype.updateMany = function (items) {
                    var _this = this;
                    var completion = new ReplaySubject_1.ReplaySubject(1);
                    this._mapper.update(items.map(function (i) { return utilities_1.slimify(i); })).subscribe(function (items) {
                        utilities_1.mergeCollection(_this.dataStore.collection, items);
                        _this.recordHistory('UPDATE');
                        completion.next(utilities_1.clone(items));
                        completion.complete();
                        _this._collection.next(_this.dataStore.collection);
                    }, function (error) { _this._errors.next(error); completion.error(error); });
                    return completion;
                };
                LocalCollectionService.prototype.delete = function (id) {
                    return this.deleteMany([id])
                        .map(function (items) { return items.find(function (i) { return true; }); });
                };
                LocalCollectionService.prototype.deleteMany = function (ids) {
                    var _this = this;
                    var completion = new ReplaySubject_1.ReplaySubject(1);
                    this._mapper.delete(ids).subscribe(function (ids) {
                        _this.removeCollectionItems(ids);
                        _this.recordHistory('DELETE');
                        completion.next(ids);
                        completion.complete();
                        _this._collection.next(_this.dataStore.collection);
                    }, function (error) { _this._errors.next(error); completion.error(error); });
                    return completion;
                };
                LocalCollectionService.prototype.recordHistory = function (action) {
                    if (this.historyStore.length >= 100) {
                        this.historyStore.shift();
                    }
                    this.historyStore.push({ action: action, state: this.dataStore });
                    this._history.next(this.historyStore);
                };
                LocalCollectionService.prototype.removeCollectionItems = function (ids) {
                    this.dataStore = Object.assign({}, this.dataStore, {
                        collection: this.dataStore.collection.filter(function (item) { return !ids.find(function (id) { return id === item.id; }); })
                    });
                };
                LocalCollectionService.prototype.assignIds = function (items) {
                    var _this = this;
                    items.forEach(function (i) { return i.id = _this.getGuid(); });
                };
                LocalCollectionService.prototype.getGuid = function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                };
                return LocalCollectionService;
            }());
            exports_2("LocalCollectionService", LocalCollectionService);
        }
    }
});
System.register("vstack-graph/graph/graph-utilities", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Relation, ServiceConfig;
    return {
        setters:[],
        execute: function() {
            Relation = (function () {
                function Relation(collectionProperty, to, relationId, many) {
                    this.collectionProperty = collectionProperty;
                    this.to = to;
                    this.relationId = relationId;
                    this.many = many;
                }
                return Relation;
            }());
            exports_3("Relation", Relation);
            ServiceConfig = (function () {
                function ServiceConfig(service, func, relations) {
                    this.service = service;
                    this.func = func;
                    this.relations = relations;
                }
                return ServiceConfig;
            }());
            exports_3("ServiceConfig", ServiceConfig);
        }
    }
});
System.register("vstack-graph/graph/base-graph.service", ['rxjs/BehaviorSubject', 'rxjs/Observable', 'rxjs/add/observable/combineLatest', "vstack-graph/utilities"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var BehaviorSubject_2, Observable_1, utilities_2;
    var BaseGraphService;
    return {
        setters:[
            function (BehaviorSubject_2_1) {
                BehaviorSubject_2 = BehaviorSubject_2_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_2) {},
            function (utilities_2_1) {
                utilities_2 = utilities_2_1;
            }],
        execute: function() {
            BaseGraphService = (function () {
                function BaseGraphService(serviceConfigs) {
                    var _this = this;
                    this.serviceConfigs = serviceConfigs;
                    var bs = new BehaviorSubject_2.BehaviorSubject(null);
                    Observable_1.Observable
                        .combineLatest(this.serviceConfigs.map(function (i) { return i.service._collection; }))
                        .map(function (i) { return _this.slimifyCollection(i); })
                        .subscribe(function (i) { return bs.next(i); });
                    this.graph = bs.map(function (i) { return i.map(function (array) { return utilities_2.clone(array); }); }).map(function (i) { return _this.toGraph(i); });
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
                                        utilities_2.mergeCollection(collection[mappingIndex], collectionItemsToUpdate);
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
            exports_4("BaseGraphService", BaseGraphService);
        }
    }
});
System.register("vstack-graph/services/vs-queryable", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var VsQueryable;
    return {
        setters:[],
        execute: function() {
            VsQueryable = (function () {
                function VsQueryable(load) {
                    this.load = load;
                }
                VsQueryable.prototype.getQueryString = function () {
                    return this.queryString;
                };
                VsQueryable.prototype.toList = function () {
                    var qs = this.getQueryString();
                    var isLoadAll = !!!qs;
                    return this.load(isLoadAll, qs);
                };
                VsQueryable.prototype.withQueryString = function (queryString) {
                    this.queryString = queryString;
                    return this;
                };
                return VsQueryable;
            }());
            exports_5("VsQueryable", VsQueryable);
        }
    }
});
System.register("vstack-graph/services/remote.service", ['rxjs/ReplaySubject', "vstack-graph/services/local.service", "vstack-graph/utilities", "vstack-graph/services/vs-queryable"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var ReplaySubject_2, local_service_1, utilities_3, vs_queryable_1;
    var BaseRemoteService, CollectionService, VSCollectionService;
    return {
        setters:[
            function (ReplaySubject_2_1) {
                ReplaySubject_2 = ReplaySubject_2_1;
            },
            function (local_service_1_1) {
                local_service_1 = local_service_1_1;
            },
            function (utilities_3_1) {
                utilities_3 = utilities_3_1;
            },
            function (vs_queryable_1_1) {
                vs_queryable_1 = vs_queryable_1_1;
            }],
        execute: function() {
            BaseRemoteService = (function (_super) {
                __extends(BaseRemoteService, _super);
                function BaseRemoteService(remotePersistenceMapper) {
                    _super.call(this, remotePersistenceMapper);
                    this.remotePersistenceMapper = remotePersistenceMapper;
                }
                Object.defineProperty(BaseRemoteService.prototype, "_remoteMapper", {
                    get: function () {
                        return this._mapper;
                    },
                    enumerable: true,
                    configurable: true
                });
                BaseRemoteService.prototype.load = function (id, options) {
                    var _this = this;
                    var completion = new ReplaySubject_2.ReplaySubject(1);
                    this._remoteMapper.load(id, options).subscribe(function (item) {
                        utilities_3.mergeCollection(_this.dataStore.collection, [item]);
                        _this.recordHistory('LOAD');
                        completion.next(utilities_3.clone(item));
                        completion.complete();
                        _this._collection.next(_this.dataStore.collection);
                    }, function (error) { _this._errors.next(error); completion.error(error); });
                    return completion;
                };
                BaseRemoteService.prototype.loadMany = function (isLoadAll, options) {
                    var _this = this;
                    var completion = new ReplaySubject_2.ReplaySubject(1);
                    this._remoteMapper.loadMany(options).subscribe(function (items) {
                        utilities_3.mergeCollection(_this.dataStore.collection, items);
                        if (isLoadAll) {
                            _this.dataStore.collection = _this.dataStore.collection.filter(function (i) { return !!items.find(function (j) { return j.id === i.id; }); });
                        }
                        _this.recordHistory('LOAD_MANY');
                        completion.next(utilities_3.clone(items));
                        completion.complete();
                        _this._collection.next(_this.dataStore.collection);
                    }, function (error) { _this._errors.next(error); completion.error(error); });
                    return completion;
                };
                return BaseRemoteService;
            }(local_service_1.LocalCollectionService));
            exports_6("BaseRemoteService", BaseRemoteService);
            CollectionService = (function (_super) {
                __extends(CollectionService, _super);
                function CollectionService(remotePersistenceMapper) {
                    _super.call(this, remotePersistenceMapper);
                }
                CollectionService.prototype.get = function (id, options) {
                    return this.load(id, options);
                };
                CollectionService.prototype.getAll = function (options) {
                    var isLoadAll = !!!options;
                    return this.loadMany(isLoadAll, options);
                };
                return CollectionService;
            }(BaseRemoteService));
            exports_6("CollectionService", CollectionService);
            VSCollectionService = (function (_super) {
                __extends(VSCollectionService, _super);
                function VSCollectionService(remotePersistenceMapper) {
                    _super.call(this, remotePersistenceMapper);
                }
                VSCollectionService.prototype.get = function (id) {
                    var _this = this;
                    return new vs_queryable_1.VsQueryable(function (isLoadAll, options) { return _this.load(id, options); });
                };
                VSCollectionService.prototype.getAll = function () {
                    var _this = this;
                    return new vs_queryable_1.VsQueryable(function (isLoadAll, options) { return _this.loadMany(isLoadAll, options); });
                };
                return VSCollectionService;
            }(BaseRemoteService));
            exports_6("VSCollectionService", VSCollectionService);
        }
    }
});
System.register("vstack-graph/services/angular-http", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var AngularHttpMapper;
    return {
        setters:[],
        execute: function() {
            AngularHttpMapper = (function () {
                function AngularHttpMapper(_a) {
                    var baseUrl = _a.baseUrl, http = _a.http, options = _a.options;
                    this.baseUrl = baseUrl;
                    this.requestOptionsArgs = options;
                    this.http = http;
                }
                AngularHttpMapper.prototype.create = function (items) {
                    return this.http.post(this.baseUrl + "/bulk", JSON.stringify(items), this.requestOptionsArgs).map(function (res) { return res.json(); });
                };
                AngularHttpMapper.prototype.update = function (items) {
                    return this.http.put(this.baseUrl + "/bulk", JSON.stringify(items), this.requestOptionsArgs).map(function (res) { return res.json(); });
                };
                AngularHttpMapper.prototype.delete = function (ids) {
                    return this.http.delete(this.baseUrl + "?ids=" + ids.join(), this.requestOptionsArgs).map(function (res) { return res.status; });
                };
                AngularHttpMapper.prototype.load = function (id, options) {
                    if (options === void 0) { options = ''; }
                    return this.http.get(this.baseUrl + "/" + id + "?" + options, this.requestOptionsArgs).map(function (res) { return res.json(); });
                };
                AngularHttpMapper.prototype.loadMany = function (options) {
                    if (options === void 0) { options = ''; }
                    return this.http.get(this.baseUrl + "?" + options, this.requestOptionsArgs).map(function (res) { return res.json(); });
                };
                return AngularHttpMapper;
            }());
            exports_7("AngularHttpMapper", AngularHttpMapper);
        }
    }
});
System.register("index", ["vstack-graph/graph/base-graph.service", "vstack-graph/graph/graph-utilities", "vstack-graph/services/remote.service", "vstack-graph/services/local.service", "vstack-graph/services/angular-http"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var base_graph_service_1, graph_utilities_1, remote_service_1, local_service_2, angular_http_1;
    return {
        setters:[
            function (base_graph_service_1_1) {
                base_graph_service_1 = base_graph_service_1_1;
            },
            function (graph_utilities_1_1) {
                graph_utilities_1 = graph_utilities_1_1;
            },
            function (remote_service_1_1) {
                remote_service_1 = remote_service_1_1;
            },
            function (local_service_2_1) {
                local_service_2 = local_service_2_1;
            },
            function (angular_http_1_1) {
                angular_http_1 = angular_http_1_1;
            }],
        execute: function() {
            exports_8("LocalCollectionService", local_service_2.LocalCollectionService);
            exports_8("CollectionService", remote_service_1.CollectionService);
            exports_8("VSCollectionService", remote_service_1.VSCollectionService);
            exports_8("BaseGraphService", base_graph_service_1.BaseGraphService);
            exports_8("ServiceConfig", graph_utilities_1.ServiceConfig);
            exports_8("Relation", graph_utilities_1.Relation);
            exports_8("AngularHttpMapper", angular_http_1.AngularHttpMapper);
        }
    }
});
//# sourceMappingURL=vstack-graph.js.map