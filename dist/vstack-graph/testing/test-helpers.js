"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/observable/of');
var base_graph_service_1 = require('./../graph/base-graph.service');
var graph_utilities_1 = require('./../graph/graph-utilities');
var utilities_1 = require('./../utilities');
var remote_service_1 = require('./../services/remote.service');
var MockPersistenceMapper = (function () {
    function MockPersistenceMapper() {
    }
    MockPersistenceMapper.prototype.create = function (items) {
        return Observable_1.Observable.of(items);
    };
    MockPersistenceMapper.prototype.update = function (items) {
        return Observable_1.Observable.of(items);
    };
    MockPersistenceMapper.prototype.delete = function (ids) {
        return Observable_1.Observable.of(ids);
    };
    MockPersistenceMapper.prototype.load = function (id, options) {
        var result = Observable_1.Observable.of(utilities_1.clone(MockPersistenceMapper.mockResponse));
        MockPersistenceMapper.mockResponse = null;
        return result;
    };
    MockPersistenceMapper.prototype.loadMany = function (options) {
        var result = Observable_1.Observable.of(utilities_1.clone(MockPersistenceMapper.mockResponse));
        MockPersistenceMapper.mockResponse = null;
        return result;
    };
    return MockPersistenceMapper;
}());
exports.MockPersistenceMapper = MockPersistenceMapper;
var TestUserService = (function (_super) {
    __extends(TestUserService, _super);
    function TestUserService() {
        _super.call(this, new MockPersistenceMapper());
    }
    return TestUserService;
}(remote_service_1.VSCollectionService));
exports.TestUserService = TestUserService;
var TestPackageService = (function (_super) {
    __extends(TestPackageService, _super);
    function TestPackageService() {
        _super.call(this, new MockPersistenceMapper());
    }
    return TestPackageService;
}(remote_service_1.VSCollectionService));
exports.TestPackageService = TestPackageService;
var TestItemService = (function (_super) {
    __extends(TestItemService, _super);
    function TestItemService() {
        _super.call(this, new MockPersistenceMapper());
    }
    return TestItemService;
}(remote_service_1.VSCollectionService));
exports.TestItemService = TestItemService;
var TestGraph = (function () {
    function TestGraph() {
    }
    return TestGraph;
}());
exports.TestGraph = TestGraph;
var TestGraphService = (function (_super) {
    __extends(TestGraphService, _super);
    function TestGraphService(testUserService, testPackageService, testItemService) {
        _super.call(this, [
            new graph_utilities_1.ServiceConfig(testUserService, function (graph, collection) { return graph.testUsers = collection; }, [
                new graph_utilities_1.Relation('testItems', testItemService, 'testUserId', true),
                new graph_utilities_1.Relation('testPackage', testPackageService, 'testPackageId', false)
            ]),
            new graph_utilities_1.ServiceConfig(testPackageService, function (graph, collection) { return graph.testPackages = collection; }, []),
            new graph_utilities_1.ServiceConfig(testItemService, function (graph, collection) { return graph.testItems = collection; }, [
                new graph_utilities_1.Relation('testUser', testUserService, 'testUserId', false)
            ])
        ]);
        this.testUserService = testUserService;
        this.testPackageService = testPackageService;
        this.testItemService = testItemService;
    }
    return TestGraphService;
}(base_graph_service_1.BaseGraphService));
exports.TestGraphService = TestGraphService;
//# sourceMappingURL=test-helpers.js.map