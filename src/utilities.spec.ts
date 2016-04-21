/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />

import {describe, expect, beforeEach, it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {Headers, HTTP_PROVIDERS, BaseRequestOptions, XHRBackend, Response, ResponseOptions, Http, ResponseType, RequestOptionsArgs} from 'angular2/http';
import {provide, Injectable, Injector} from 'angular2/core';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {RestCollection} from './rest-collection';

import {slimify, isPrimitive, clone} from './utilities';

describe('Utilities Specs', () => {
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
    
    it('should be able to clone Dates, Objects and Arrays', () => {
       let testDate = new Date();
       let testObject = { id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] };
       let testArray = [{ id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] }, { id: 2, utcDate: new Date(), accounts: ['Visa', 'Discover'] }];
       
       expect(clone(testDate).getTime()).toBe(testDate.getTime());
       expect(clone(testObject).id).toBe(1);
       expect(clone(testObject).utcDate.getTime()).toBe(testObject.utcDate.getTime());
       expect(clone(testObject).accounts[0]).toBe('Visa');
       expect(clone(testArray).length).toBe(2);
       // expect(clone(undefined)).toThrowError();
    });
});