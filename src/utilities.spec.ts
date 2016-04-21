/// <reference path="../typings/browser/ambient/jasmine/jasmine.d.ts" />

import {describe, expect, beforeEach, it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {Headers, HTTP_PROVIDERS, BaseRequestOptions, XHRBackend, Response, ResponseOptions, Http, ResponseType, RequestOptionsArgs} from 'angular2/http';
import {provide, Injectable, Injector} from 'angular2/core';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {RestCollection} from './rest-collection';

import {clone, isPrimitive} from './utilities';

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
});