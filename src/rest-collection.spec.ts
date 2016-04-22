/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />

import {describe, expect, beforeEach, it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {Headers, HTTP_PROVIDERS, BaseRequestOptions, XHRBackend, Response, ResponseOptions, Http, ResponseType, RequestOptionsArgs} from 'angular2/http';
import {provide, Injectable, Injector} from 'angular2/core';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {RestCollection} from './rest-collection';

interface TestCollectionItem {
    id: any;
    value: string;
}

@Injectable()
class MockItemService extends RestCollection<TestCollectionItem> {
    constructor(http: Http) {
        super({ baseUrl: 'http://56e05c3213da80110013eba3.mockapi.io/api/items', options: {}, http });
    }
}

describe('RestCollection Specs', () => {
    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            MockBackend,
            BaseRequestOptions,
            MockItemService,
            provide(Http, {
                useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => new Http(backend, defaultOptions),
                deps: [MockBackend, BaseRequestOptions]
            })
        ];
    });

    it('should load a list of items', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' },
                    { id: 3, value: 'value 3' }
                ]
            })));
        });

        return new Promise(resolve => {
            mockItemService.collection$
                .skip(1)
                .do(() => resolve())
                .do(items => expect(items.length).toBe(3))
                .subscribe();

            mockItemService.loadAll();
        });
    }));

    it('should handle loading a list of items failure', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => connection.mockError(new Error('ERROR')));

        return new Promise(resolve => {
            mockItemService.errors$
                .skip(1)
                .do(() => resolve())
                .do(err => expect(err).toBeDefined())
                .subscribe();

            mockItemService.loadAll();
        });
    }));

    it('should load a single item', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });

        return new Promise(resolve => {
            mockItemService.collection$
                .skip(1)
                .do(() => resolve())
                .do(items => expect(items[1].id).toBe(1))
                .subscribe();

            mockItemService.load(1);
        });
    }));

    it('should handle loading a item failure', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => connection.mockError(new Error('ERROR')));

        return new Promise(resolve => {
            mockItemService.errors$
                .skip(1)
                .do(() => resolve())
                .do(err => expect(err).toBeDefined())
                .subscribe();

            mockItemService.load(1);
        });
    }));

    it('should create a item', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });

        return new Promise(resolve => {
            mockItemService.collection$
                .skip(1)
                .do(() => resolve())
                .do(items => expect(items[1].value).toBe('value 1'))
                .subscribe();

            mockItemService.create({ value: 'value 1' });
        });
    }));

    it('should handle creating a item failure', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => connection.mockError(new Error('ERROR')));

        return new Promise(resolve => {
            mockItemService.errors$
                .skip(1)
                .do(() => resolve())
                .do(err => expect(err).toBeDefined())
                .subscribe();

            mockItemService.create({});
        });
    }));

    it('should update a item', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 2' } })));
        });

        return new Promise(resolve => {
            mockItemService.collection$
                .skip(1)
                .do(() => resolve())
                .do(items => expect(items[0].value).toBe('value 2'))
                .subscribe();

            mockItemService.update({ id: 1, value: 'value 2' });
        });
    }));

    it('should handle updating a item failure', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => connection.mockError(new Error('ERROR')));
        
        return new Promise(resolve => {
            mockItemService.errors$
                .skip(1)
                .do(() => resolve())
                .do(err => expect(err).toBeDefined())
                .subscribe();

            mockItemService.update({ id: 1 });
        });
    }));

    it('should remove a item', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });
        
        return new Promise(resolve => {
            mockItemService.collection$
                .skip(1)
                .do(() => resolve())
                .do(items => expect(items.length).toBe(0))
                .subscribe();

            mockItemService.remove(1);
        });
    }));

    it('should handle removing a item failure', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => connection.mockError(new Error('ERROR')));
        
        return new Promise(resolve => {
            mockItemService.errors$
                .skip(1)
                .do(() => resolve())
                .do(err => expect(err).toBeDefined())
                .subscribe();

            mockItemService.remove(1);
        });
    }));

    it('should allow a subscription of errors', injectAsync([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' }, status: 404 })));
        });
        
        return new Promise(resolve => {
            mockItemService.errors$
                .do(() => resolve())
                .do(err => expect(err).toBeDefined())
                .subscribe();

            mockItemService.remove(1);
        });
    }));
});