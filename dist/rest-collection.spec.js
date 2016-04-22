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
        _super.call(this, { baseUrl: 'http://56e05c3213da80110013eba3.mockapi.io/api/items', options: {}, http: http });
    }
    MockItemService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MockItemService);
    return MockItemService;
}(rest_collection_1.RestCollection));
testing_1.describe('RestCollection Specs', function () {
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
    testing_1.it('should load a list of items', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
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
                .do(function (items) { return testing_1.expect(items.length).toBe(3); })
                .subscribe();
            mockItemService.loadAll();
        });
    }));
    testing_1.it('should handle loading a list of items failure', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
        return new Promise(function (resolve) {
            mockItemService.errors$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (err) { return testing_1.expect(err).toBeDefined(); })
                .subscribe();
            mockItemService.loadAll();
        });
    }));
    testing_1.it('should load a single item', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });
        return new Promise(function (resolve) {
            mockItemService.collection$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (items) { return testing_1.expect(items[1].id).toBe(1); })
                .subscribe();
            mockItemService.load(1);
        });
    }));
    testing_1.it('should handle loading a item failure', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
        return new Promise(function (resolve) {
            mockItemService.errors$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (err) { return testing_1.expect(err).toBeDefined(); })
                .subscribe();
            mockItemService.load(1);
        });
    }));
    testing_1.it('should create a item', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });
        return new Promise(function (resolve) {
            mockItemService.collection$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (items) { return testing_1.expect(items[1].value).toBe('value 1'); })
                .subscribe();
            mockItemService.create({ value: 'value 1' });
        });
    }));
    testing_1.it('should handle creating a item failure', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
        return new Promise(function (resolve) {
            mockItemService.errors$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (err) { return testing_1.expect(err).toBeDefined(); })
                .subscribe();
            mockItemService.create({});
        });
    }));
    testing_1.it('should update a item', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 2' } })));
        });
        return new Promise(function (resolve) {
            mockItemService.collection$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (items) { return testing_1.expect(items[0].value).toBe('value 2'); })
                .subscribe();
            mockItemService.update({ id: 1, value: 'value 2' });
        });
    }));
    testing_1.it('should handle updating a item failure', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
        return new Promise(function (resolve) {
            mockItemService.errors$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (err) { return testing_1.expect(err).toBeDefined(); })
                .subscribe();
            mockItemService.update({ id: 1 });
        });
    }));
    testing_1.it('should remove a item', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });
        return new Promise(function (resolve) {
            mockItemService.collection$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (items) { return testing_1.expect(items.length).toBe(0); })
                .subscribe();
            mockItemService.remove(1);
        });
    }));
    testing_1.it('should handle removing a item failure', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(new Error('ERROR')); });
        return new Promise(function (resolve) {
            mockItemService.errors$
                .skip(1)
                .do(function () { return resolve(); })
                .do(function (err) { return testing_1.expect(err).toBeDefined(); })
                .subscribe();
            mockItemService.remove(1);
        });
    }));
    testing_1.it('should allow a subscription of errors', testing_1.injectAsync([testing_2.MockBackend, MockItemService], function (mockBackend, mockItemService) {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { id: 1, value: 'value 1' }, status: 404 })));
        });
        return new Promise(function (resolve) {
            mockItemService.errors$
                .do(function () { return resolve(); })
                .do(function (err) { return testing_1.expect(err).toBeDefined(); })
                .subscribe();
            mockItemService.remove(1);
        });
    }));
});
//# sourceMappingURL=rest-collection.spec.js.map