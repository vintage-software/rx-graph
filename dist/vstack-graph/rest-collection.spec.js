"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var http_1 = require('angular2/http');
var rest_collection_1 = require('./rest-collection');
var mock_http_1 = require('./testing/mock-http');
var MockCollectionService = (function (_super) {
    __extends(MockCollectionService, _super);
    function MockCollectionService(http) {
        _super.call(this, { baseUrl: 'http://56e05c3213da80110013eba3.mockapi.io/api/items', options: {}, http: http });
    }
    return MockCollectionService;
}(rest_collection_1.RestCollection));
describe('RestCollection Specs New', function () {
    it('should load a list of items', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({
            body: [
                { id: 1, value: 'value 1' },
                { id: 2, value: 'value 2' },
                { id: 3, value: 'value 3' }
            ]
        }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(response));
        mockCollectionService.collection$
            .skip(1)
            .do(function (items) { return expect(items.length).toBe(3); })
            .subscribe();
        mockCollectionService.loadAll();
    });
    it('should handle loading a list of items failure', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(new Error('ERROR')));
        mockCollectionService.errors$
            .skip(1)
            .do(function (err) { return expect(err).toBeDefined(); })
            .subscribe();
        mockCollectionService.loadAll();
    });
    it('should load a single item', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(response));
        mockCollectionService.collection$
            .skip(1)
            .do(function (items) { return expect(items[0].id).toBe(1); })
            .subscribe();
        mockCollectionService.load(1);
    });
    it('should handle loading a item failure', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(new Error('ERROR')));
        mockCollectionService.errors$
            .skip(1)
            .do(function (err) { return expect(err).toBeDefined(); })
            .subscribe();
        mockCollectionService.load(1);
    });
    it('should create a item', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(response));
        mockCollectionService.collection$
            .skip(1)
            .do(function (items) { return expect(items[0].id).toBe(1); })
            .subscribe();
        mockCollectionService.create({ value: 'value 1' });
    });
    it('should handle creating a item failure', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(new Error('ERROR')));
        mockCollectionService.errors$
            .skip(1)
            .do(function (err) { return expect(err).toBeDefined(); })
            .subscribe();
        mockCollectionService.create({});
    });
    it('should update a item', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 2' } }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(response));
        mockCollectionService.collection$
            .skip(1)
            .do(function (items) { return expect(items[0].value).toBe('value 2'); })
            .subscribe();
        mockCollectionService.update({ id: 1, value: 'value 2' });
    });
    it('should handle updating a item failure', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(new Error('ERROR')));
        mockCollectionService.errors$
            .skip(1)
            .do(function (err) { return expect(err).toBeDefined(); })
            .subscribe();
        mockCollectionService.update({ id: 1 });
    });
    it('should remove a item', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ body: null }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(response));
        mockCollectionService.collection$
            .skip(1)
            .do(function (items) { return expect(items.length).toBe(0); })
            .subscribe();
        mockCollectionService.remove(1);
    });
    it('should handle removing a item failure', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(new Error('ERROR')));
        mockCollectionService.errors$
            .skip(1)
            .do(function (err) { return expect(err).toBeDefined(); })
            .subscribe();
        mockCollectionService.remove(1);
    });
    it('should allow a subscription of errors', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({}));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(response));
        mockCollectionService.errors$
            .do(function (err) { return expect(err).toBeDefined(); })
            .subscribe();
    });
    it('should allow a subscription of history', function () {
        var response = new http_1.Response(new http_1.ResponseOptions({}));
        var mockCollectionService = new MockCollectionService(new mock_http_1.MockHttp(response));
        mockCollectionService.history$
            .do(function (err) { return expect(err).toBeDefined(); })
            .subscribe();
    });
});
//# sourceMappingURL=rest-collection.spec.js.map