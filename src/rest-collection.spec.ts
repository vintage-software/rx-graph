/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />

import {describe, expect, beforeEach, it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {Headers, HTTP_PROVIDERS, BaseRequestOptions, XHRBackend, Response, ResponseOptions, Http} from 'angular2/http';
import {provide, Injectable, Injector} from 'angular2/core';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {RestCollection} from './rest-collection';

interface item {
    id: any;
    createdAt: number;
    value: string;
}

@Injectable()
class MockItemService extends RestCollection<item> {
    constructor(http: Http) {
        super('http://56e05c3213da80110013eba3.mockapi.io/api/items', http);
    }
}

describe('MyService Tests', () => {
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

    it('should load a single item', inject([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });

        mockItemService.load(1);
        mockItemService.collection$.subscribe(items => expect(items.length).toBe(1));
    }));

    it('should load a list of items', inject([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' },
                    { id: 3, value: 'value 3' }
                ]
            })));
        });
        
        mockItemService.loadAll();
        mockItemService.collection$.subscribe(items => expect(items.length).toBe(3));
    }));

    it('should create a item', inject([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });
       
        mockItemService.create({ value: 'value 1' });
        mockItemService.collection$.subscribe(items => expect(items.length).toBe(1));
    }));

    it('should update a item', inject([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 2' } })));
        });

        mockItemService.update({ id: 1, value: 'value 2' });
        mockItemService.collection$.subscribe(items => expect(items[0].value).toBe('value 2'));
    }));

    it('should remove a item', inject([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } })));
        });

        // mockItemService.load(1);
        mockItemService.remove(1);

        mockItemService.collection$.subscribe(items => {
            expect(items.length).toBe(0);
        });
    }));
    
    it('should allow a subscription of errors', inject([MockBackend, MockItemService], (mockBackend: MockBackend, mockItemService: MockItemService) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' }, status: 404 })));
        });
        
        mockItemService.errors$.subscribe(err => {
           expect(err).toBeDefined(); 
        });
    }));
});