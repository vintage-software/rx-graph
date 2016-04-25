"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var testing_1 = require('angular2/testing');
var http_1 = require('angular2/http');
var Observable_1 = require('rxjs/Observable');
var rest_collection_1 = require('./rest-collection');
var graph_service_1 = require('./graph-service');
var graph_helpers_1 = require('./graph-helpers');
var mock_http_1 = require('./testing/mock-http');
var TestUserService = (function (_super) {
    __extends(TestUserService, _super);
    function TestUserService(http) {
        _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
    }
    return TestUserService;
}(rest_collection_1.RestCollection));
var TestItemService = (function (_super) {
    __extends(TestItemService, _super);
    function TestItemService(http) {
        _super.call(this, { baseUrl: '/xyz', options: {}, http: http });
    }
    return TestItemService;
}(rest_collection_1.RestCollection));
var TestGraphService = (function (_super) {
    __extends(TestGraphService, _super);
    function TestGraphService(testUserService, testItemService) {
        _super.call(this, [
            new graph_helpers_1.ServiceConfig(testUserService, function (graph, collection) { return graph.testUsers = collection; }, [
                new graph_helpers_1.Mapping('testItems', testItemService, 'userId', true)
            ]),
            new graph_helpers_1.ServiceConfig(testItemService, function (graph, collection) { return graph.testItems = collection; }, [])
        ]);
    }
    return TestGraphService;
}(graph_service_1.GraphService));
var TestGraph = (function () {
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
        return Observable_1.Observable.of(5).delay(500).toPromise()
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
    testing_1.it('should have users should have items mapping', function () {
        testGraphService.graph$
            .skip(2)
            .do(function (graph) {
            testing_1.expect(graph.testUsers.length).toBe(3);
            testing_1.expect(graph.testItems.length).toBe(3);
            graph.testItems.map(function (i) { return testing_1.expect(!!i.testUser).toBe(false); });
            testing_1.expect(graph.testUsers.find(function (i) { return i.id === 1; }).testItems.length).toBe(2);
            testing_1.expect(graph.testUsers.find(function (i) { return i.id === 2; }).testItems.length).toBe(1);
            testing_1.expect(graph.testUsers.find(function (i) { return i.id === 3; }).testItems.length).toBe(0);
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
                { id: 1, value: 'item 1', userId: 1 },
                { id: 2, value: 'item 2', userId: 1 },
                { id: 3, value: 'item 3', userId: 2 }
            ]
        })));
        testItemService.loadAll();
    });
});
//# sourceMappingURL=graph-service.spec.js.map