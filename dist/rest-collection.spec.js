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
var rest_collection_1 = require('./rest-collection');
var MockItemService = (function (_super) {
    __extends(MockItemService, _super);
    function MockItemService(http) {
        _super.call(this, 'http://56e05c3213da80110013eba3.mockapi.io/api/items', http);
    }
    MockItemService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MockItemService);
    return MockItemService;
}(rest_collection_1.RestCollection));
testing_1.describe('MyService Tests', function () {
    testing_1.beforeEachProviders(function () {
        return [
            http_1.HTTP_PROVIDERS,
            testing_2.MockBackend,
            http_1.BaseRequestOptions,
            MockItemService,
            core_1.provide(http_1.Http, {
                useFactory: function (backend, defaultOptions) { return new http_1.Http(backend, defaultOptions); },
                deps: [testing_2.MockBackend, http_1.BaseRequestOptions]
            })
        ];
    });
    testing_1.it('should load a list of items', testing_1.inject([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
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
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
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
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
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
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 2' } })));
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
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
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
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' }, status: 404 })));
        });
        mockItemService.errors$.subscribe(function (err) { return testing_1.expect(err).toBeDefined(); });
    }));
});
//# sourceMappingURL=rest-collection.spec.js.map