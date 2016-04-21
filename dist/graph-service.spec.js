"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var testing_1 = require('angular2/testing');
var http_1 = require('angular2/http');
var core_1 = require('angular2/core');
var testing_2 = require('angular2/http/testing');
var Observable_1 = require('rxjs/Observable');
var rest_collection_1 = require('./rest-collection');
var graph_service_1 = require('./graph-service');
var graph_helpers_1 = require('./graph-helpers');
var TestUserService = (function (_super) {
    __extends(TestUserService, _super);
    function TestUserService(http) {
        _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
    }
    TestUserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TestUserService);
    return TestUserService;
}(rest_collection_1.RestCollection));
var TestItemService = (function (_super) {
    __extends(TestItemService, _super);
    function TestItemService(http) {
        _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
    }
    TestItemService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TestItemService);
    return TestItemService;
}(rest_collection_1.RestCollection));
var TestGraphService = (function (_super) {
    __extends(TestGraphService, _super);
    function TestGraphService(testUserService, testItemService) {
        _super.call(this, [
            new graph_helpers_1.ServiceConfig(testUserService, function (graph, collection) { return graph.testUsers = collection; }, []),
            new graph_helpers_1.ServiceConfig(testItemService, function (graph, collection) { return graph.testItems = collection; }, [])
        ]);
    }
    TestGraphService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [TestUserService, TestItemService])
    ], TestGraphService);
    return TestGraphService;
}(graph_service_1.GraphService));
var TestGraph = (function () {
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
            core_1.provide(http_1.Http, {
                useFactory: function (backend, defaultOptions) { return new http_1.Http(backend, defaultOptions); },
                deps: [testing_2.MockBackend, http_1.BaseRequestOptions]
            })
        ];
    });
    testing_1.it('tests a dummy Observable', testing_1.injectAsync([], function () {
        return Observable_1.Observable.of(5).delay(500).toPromise()
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
//# sourceMappingURL=graph-service.spec.js.map