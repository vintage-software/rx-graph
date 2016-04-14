import {it,describe,expect,inject,injectAsync,beforeEachProviders} from 'angular2/testing';
import {provide, Injector} from 'angular2/core';

import {MockBackend} from 'angular2/http/testing';
import {RestCollection} from './rest-collection';


describe('MyService Tests', () => {
    let service:MyService = new MyService();
 
    it('Should return a list of dogs', () => {
        var items = service.getDogs(4);
 
        expect(items).toEqual(['golden retriever', 'french bulldog', 'german shepherd', 'alaskan husky']);
    });
 
    it('Should get all dogs available', () => {
        var items = service.getDogs(100);
 
        expect(items).toEqual(['golden retriever', 'french bulldog', 'german shepherd', 'alaskan husky', 'jack russel terrier', 'boxer', 'chow chow', 'pug', 'akita', 'corgi', 'labrador']);
    });
});

// http://twofuckingdevelopers.com/2016/01/testing-angular-2-with-karma-and-jasmine/