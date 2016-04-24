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
import {MockHttp} from './testing/mock-http';
import {IHttp} from './interfaces/http';

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

class TestUserService extends RestCollection<TestUser> {
    constructor(http: IHttp) {
        super({ baseUrl: '/xyz', options: {}, http });
    }
}

class TestItemService extends RestCollection<TestItem> {
    constructor(http: IHttp) {
        super({ baseUrl: '/xyz', options: {}, http });
    }
}

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
    let testGraphService, testUserService, testItemService, mockHttp;

    beforeEach(() => {
        mockHttp = new MockHttp({});
        testUserService = new TestUserService(mockHttp);
        testItemService = new TestItemService(mockHttp);
        testGraphService = new TestGraphService(testUserService, testItemService);
    });

    it('tests a dummy Observable', () => {
        return Observable.of(5).delay(500).toPromise()
            .then((val) => { expect(val).toEqual(5) });
    });

    it('should be empty graph', () => {
        testGraphService.graph$
            .do(graph => expect(graph.testItems.length).toBe(0))
            .subscribe();
    });

    it('should be populated graph', () => {
        mockHttp.setMockResponse(new Response(new ResponseOptions({ body: [
            { id: 1, value: 'user 1' },
            { id: 2, value: 'user 2' },
            { id: 3, value: 'user 3' }
        ]})));
        
        testGraphService.graph$
            .skip(1)
            .do(graph => expect(graph.testItems.length).toBe(3))
            .subscribe();

        testItemService.loadAll();
    });

    // it('should have items on user', () => {
    //         let test = graphService.graph$
    //             .do(graph => {
    //                 //expect(graph.testUsers.length).toBe(3);
    //                 // expect(graph.testItems.length).toBe(3);
    //                 // graph.testItems.map(i => expect(!!i.testUser).toBe(false));
    //                 // expect(graph.testUsers.find(i => i.id === 1).testItems.length).toBe(2);
    //                 // expect(graph.testUsers.find(i => i.id === 2).testItems.length).toBe(0);
    //                 // expect(graph.testUsers.find(i => i.id === 3).testItems.length).toBe(1);
    //             })
    //             .do(graph => resolve());

    //         setupUsers(mockBackend);
    //         testUserService.loadAll();

    //         setupItems(mockBackend);
    //         testItemService.loadAll();

    //         setTimeout(i => test.subscribe(), 0);
    // });

    // function setupUsers(mockBackend: MockBackend) {
    //     setupMockBackend(mockBackend, [
    //         { id: 1, name: 'user 1' },
    //         { id: 2, name: 'user 2' },
    //         { id: 3, name: 'user 3' }
    //     ]);
    // }

    // function setupItems(mockBackend: MockBackend) {
    //     setupMockBackend(mockBackend, [
    //         { id: 1, value: 'item 1', userId: 1 },
    //         { id: 2, value: 'item 2', userId: 1 },
    //         { id: 3, value: 'item 3', userId: 3 }
    //     ]);
    // }

    // function setupMockBackend(mockBackend: MockBackend, body: any) {
    //     mockBackend.connections.subscribe((connection: MockConnection) => {
    //         connection.mockRespond(new Response(new ResponseOptions({
    //             body
    //         })));
    //     });
    // }
});