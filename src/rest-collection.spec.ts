/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />

import {describe, expect, beforeEach, it} from 'angular2/testing';
import {Response, ResponseOptions} from 'angular2/http';

import {RestCollection} from './rest-collection';
import {MockHttp} from './testing/mock-http';
import {IHttp} from './interfaces/http';

interface TestCollectionItem {
    id: any;
    value: string;
}

class MockCollectionService extends RestCollection<TestCollectionItem> {
    constructor(http: IHttp) {
        super({ baseUrl: 'http://56e05c3213da80110013eba3.mockapi.io/api/items', options: {}, http });
    }
}

describe('RestCollection Specs New', () => {
    it('should load a list of items', () => {
        let response = new Response(new ResponseOptions({
            body: [
                { id: 1, value: 'value 1' },
                { id: 2, value: 'value 2' },
                { id: 3, value: 'value 3' }
            ]
        }));

        let mockCollectionService = new MockCollectionService(new MockHttp(response));

        mockCollectionService.collection$
            .skip(1)
            .do(items => expect(items.length).toBe(3))
            .subscribe();

        mockCollectionService.loadAll();
    });

    it('should handle loading a list of items failure', () => {
        let response = new Response(new ResponseOptions({ status: 404 }));
        let mockCollectionService = new MockCollectionService(new MockHttp(new Error('ERROR')));

        mockCollectionService.errors$
            .skip(1)
            .do(err => expect(err).toBeDefined())
            .subscribe();

        mockCollectionService.loadAll();
    });

    it('should load a single item', () => {
        let response = new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } }));
        let mockCollectionService = new MockCollectionService(new MockHttp(response));

        mockCollectionService.collection$
            .skip(1)
            .do(items => expect(items[0].id).toBe(1))
            .subscribe();

        mockCollectionService.load(1);
    });

    it('should handle loading a item failure', () => {
        let response = new Response(new ResponseOptions({ status: 404 }));
        let mockCollectionService = new MockCollectionService(new MockHttp(new Error('ERROR')));

        mockCollectionService.errors$
            .skip(1)
            .do(err => expect(err).toBeDefined())
            .subscribe();

        mockCollectionService.load(1);
    });

    it('should create a item', () => {
        let response = new Response(new ResponseOptions({ body: { id: 1, value: 'value 1' } }));
        let mockCollectionService = new MockCollectionService(new MockHttp(response));

        mockCollectionService.collection$
            .skip(1)
            .do(items => expect(items[0].id).toBe(1))
            .subscribe();

        mockCollectionService.create({ value: 'value 1' });
    });

    it('should handle creating a item failure', () => {
        let response = new Response(new ResponseOptions({ status: 404 }));
        let mockCollectionService = new MockCollectionService(new MockHttp(new Error('ERROR')));

        mockCollectionService.errors$
            .skip(1)
            .do(err => expect(err).toBeDefined())
            .subscribe();

        mockCollectionService.create({});
    });

    it('should update a item', () => {
        let response = new Response(new ResponseOptions({ body: { id: 1, value: 'value 2' } }));
        let mockCollectionService = new MockCollectionService(new MockHttp(response));

        mockCollectionService.collection$
            .skip(1)
            .do(items => expect(items[0].value).toBe('value 2'))
            .subscribe();

        mockCollectionService.update({ id: 1, value: 'value 2' });
    });

    it('should handle updating a item failure', () => {
        let response = new Response(new ResponseOptions({ status: 404 }));
        let mockCollectionService = new MockCollectionService(new MockHttp(new Error('ERROR')));

        mockCollectionService.errors$
            .skip(1)
            .do(err => expect(err).toBeDefined())
            .subscribe();

        mockCollectionService.update({ id: 1 });
    });

    it('should remove a item', () => {
        let response = new Response(new ResponseOptions({ body: null }));
        let mockCollectionService = new MockCollectionService(new MockHttp(response));

        mockCollectionService.collection$
            .skip(1)
            .do(items => expect(items.length).toBe(0))
            .subscribe();

        mockCollectionService.remove(1);
    });

    it('should handle removing a item failure', () => {
        let response = new Response(new ResponseOptions({ status: 404 }));
        let mockCollectionService = new MockCollectionService(new MockHttp(new Error('ERROR')));

        mockCollectionService.errors$
            .skip(1)
            .do(err => expect(err).toBeDefined())
            .subscribe();

        mockCollectionService.remove(1);
    });

    it('should allow a subscription of errors', () => {
        let response = new Response(new ResponseOptions({}));
        let mockCollectionService = new MockCollectionService(new MockHttp(response));

        mockCollectionService.errors$
            .do(err => expect(err).toBeDefined())
            .subscribe();
    });

    it('should allow a subscription of history', () => {
        let response = new Response(new ResponseOptions({}));
        let mockCollectionService = new MockCollectionService(new MockHttp(response));

        mockCollectionService.history$
            .do(err => expect(err).toBeDefined())
            .subscribe();
    });
});