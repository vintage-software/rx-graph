/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />

import {describe, expect, beforeEach, it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {Headers, HTTP_PROVIDERS, BaseRequestOptions, XHRBackend, Response, ResponseOptions, Http, ResponseType, RequestOptionsArgs} from 'angular2/http';
import {provide, Injectable, Injector} from 'angular2/core';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {Observable} from 'rxjs/Observable';
import {RestCollection} from './rest-collection';
import {GraphService} from './graph-service';
import {ServiceConfig} from './graph-helpers';

interface TestUser {
    id: any;
    value: string;
    testItems: TestItem[];
}

interface TestItem {
    id: any;
    value: string;
    testUserId: any;
    testUser: TestUser;
}

@Injectable()
class TestUserService extends RestCollection<TestUser> {
    constructor(http: Http) {
        super({ baseUrl: '/xyz', options: {}, http });
    }
}

@Injectable()
class TestItemService extends RestCollection<TestItem> {
    constructor(http: Http) {
        super({ baseUrl: '/xyz', options: {}, http });
    }
}

@Injectable()
class TestGraphService extends GraphService<TestGraph> {
    constructor(testUserService: TestUserService, testItemService: TestItemService) {
        super([
            new ServiceConfig<TestUser, TestGraph>(
                testUserService, (graph, collection) => graph.testUsers = collection, [

                ]
            ),
            new ServiceConfig<TestItem, TestGraph>(
                testItemService, (graph, collection) => graph.testItems = collection, [

                ]
            )
        ]);
    }
}

class TestGraph {
    testUsers: TestUser[];
    testItems: TestItem[];
}

describe('GraphService Specs', () => {
    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            MockBackend,
            BaseRequestOptions,
            TestUserService,
            TestItemService,
            TestGraphService,
            provide(Http, {
                useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => new Http(backend, defaultOptions),
                deps: [MockBackend, BaseRequestOptions]
            })
        ];
    });

    it('tests a dummy Observable', injectAsync([], () => {
        return Observable.of(5).delay(500).toPromise()
            .then((val) => { expect(val).toEqual(5) });
    }));

    it('should be empty graph', injectAsync([TestGraphService], (graphService: TestGraphService) => {
        return new Promise(resolve => {
            graphService.graph$
                .do(graph => expect(graph.testItems.length).toBe(0))
                .do(graph => resolve())
                .subscribe();
        });
    }));

    it('should be populated graph', injectAsync([MockBackend, TestItemService, TestGraphService], (mockBackend: MockBackend, testItemService: TestItemService, graphService: TestGraphService) => {
        setupMockBackend(mockBackend, [
            { id: 1, value: 'value 1' },
            { id: 2, value: 'value 2' },
            { id: 3, value: 'value 3' }
        ]);

        return new Promise(resolve => {
            graphService.graph$
                .skip(1)
                .do(graph => expect(graph.testItems.length).toBe(3))
                .do(graph => resolve())
                .subscribe();
            
            testItemService.loadAll();
        });
    }));
    
    it('should have items on user', injectAsync([MockBackend, TestItemService, TestGraphService], (mockBackend: MockBackend, testItemService: TestItemService, graphService: TestGraphService) => {
        setupMockBackend(mockBackend, [
            { id: 1, value: 'value 1' },
            { id: 2, value: 'value 2' },
            { id: 3, value: 'value 3' }
        ]);

        return new Promise(resolve => {
            graphService.graph$
                .skip(1)
                .do(graph => expect(graph.testItems.length).toBe(3))
                .do(graph => resolve())
                .subscribe();
            
            testItemService.loadAll();
        });
    }));

    // function setupUsers(params:type) {
        
    // }

    function setupMockBackend(mockBackend: MockBackend, body: any) {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body
            })));
        });
    }


    //it('run example test', inject([MockBackend, TestItemService, TestGraphService], (mockBackend: MockBackend, testItemService: TestItemService, graphService: TestGraphService) => {

    // mockBackend.connections.subscribe((connection: MockConnection) => {
    //     connection.mockRespond(new Response(new ResponseOptions({
    //         body: [
    //             { id: 1, value: 'value 1' },
    //             { id: 2, value: 'value 2' },
    //             { id: 3, value: 'value 3' }
    //         ]
    //     })));
    // });

    // mockItemService.loadAll();
    // mockItemService.collection$.subscribe(items => expect(items.length).toBe(3));
    //}));
});