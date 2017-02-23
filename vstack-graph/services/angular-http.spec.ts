/// <reference path="../typings.d.ts" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AngularHttp } from './http';
import { AngularHttpMapper } from './angular-http';

let mockAngularHttp: AngularHttp = {
  get: () => Observable.of({ json: () => true }),
  put: () => Observable.of({ json: () => true }),
  post: () => Observable.of({ json: () => true }),
  patch: () => Observable.of({ json: () => true }),
  delete: () => Observable.of({ json: () => true })
};

describe('Angular Http Adapter Specs', () => {
  let angularHttpMapper = new AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });

  beforeEach(() => {
    angularHttpMapper = new AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });
  });

  it('should have a create method', () => {
    angularHttpMapper.create([]).subscribe(val => {
      expect(val).toBe(true);
    });
  });

  it('should have a update method', () => {
    angularHttpMapper.update([]).subscribe(val => {
      expect(val).toBe(true);
    });
  });

  it('should have a delete method', () => {
    angularHttpMapper.delete([]).subscribe(val => {
      expect(val).toBe(undefined);
    });
  });

  it('should have a load method', () => {
    angularHttpMapper.load('1').subscribe(val => {
      expect(val).toBe(true);
    });
  });

  it('should have a loadMany method', () => {
    angularHttpMapper.loadMany().subscribe(val => {
      expect(val).toBe(true);
    });
  });
});
