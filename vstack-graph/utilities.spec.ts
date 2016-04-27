/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />
import {Headers, HTTP_PROVIDERS, BaseRequestOptions, XHRBackend, Response, ResponseOptions, Http, ResponseType, RequestOptionsArgs} from 'angular2/http';
import {provide, Injectable, Injector} from 'angular2/core';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';

import {slimify, isPrimitive, clone, mergeCollection} from './utilities';

describe('isPrimitive', () => {
    it('should detect primitives', () => {
        expect(isPrimitive('Hello World')).toBe(true);
        expect(isPrimitive(true)).toBe(true);
        expect(isPrimitive(42)).toBe(true);
        expect(isPrimitive(null)).toBe(true);
        expect(isPrimitive(undefined)).toBe(true);
        expect(isPrimitive(new Date())).toBe(true);

        expect(isPrimitive({})).toBe(false);
        expect(isPrimitive([])).toBe(false);
    });
});

describe('slimify', () => {
    it('should be able to slimify objects', () => {
        let complexObject = {
            id: 1,
            name: 'John Doe',
            includedAccounts: ['Visa', 'Mastercard', 'Discover'],
            includedSession: { token: '1234' }
        }

        expect(slimify(complexObject).includedAccounts).toBe(null);
        expect(slimify(complexObject).includedSession).toBe(null);
    });
});

describe('clone', () => {
    it('should be able to clone Dates, Objects and Arrays', () => {
        let testDate = new Date();
        let testObject = { id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] };
        let testArray = [{ id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] }, { id: 2, utcDate: new Date(), accounts: ['Visa', 'Discover'] }];

        expect(clone(testDate).getTime()).toBe(testDate.getTime());
        expect(clone(testObject).id).toBe(1);
        expect(clone(testObject).utcDate.getTime()).toBe(testObject.utcDate.getTime());
        expect(clone(testObject).accounts[0]).toBe('Visa');
        expect(clone(testArray).length).toBe(2);
    });
});

describe('mergeCollection', () => {
    it('should merge two collections', () => {
        let collection1 = [{ id: 1, value: 'value 1' }, { id: 2, value: 'value 2'}];
        let collection2 = [{ id: 1, value: 'updated value' }, { id: 3, value: 'value 3'}];
        
        mergeCollection(collection1, collection2);
        
        expect(collection1[0].value).toBe('updated value');
        expect(collection1.length).toBe(3);
    });
});