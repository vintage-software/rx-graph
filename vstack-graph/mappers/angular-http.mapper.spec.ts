import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AngularHttp } from './angular-http';
import { AngularHttpMapper } from './angular-http.mapper';

const items = [{ id: 1 }];

let mockAngularHttp: AngularHttp = {
  get: (url: string) => Observable.of({ json: () => url.endsWith('/1?') ? items[0] : items }),
  put: () => Observable.of({ json: () => items }),
  post: () => Observable.of({ json: () => items }),
  patch: () => Observable.of({ json: () => items }),
  delete: () => Observable.of({ json: () => items })
};

describe('Angular Http Adapter Specs', () => {
  let angularHttpMapper = new AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });

  beforeEach(() => {
    angularHttpMapper = new AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });
  });

  it('should have a create method', () => {
    angularHttpMapper.create([]).subscribe(val => {
      expect(val).toBe(items);
    });
  });

  it('should have a update method', () => {
    angularHttpMapper.update([]).subscribe(val => {
      expect(val).toBe(items);
    });
  });

  it('should have a delete method', () => {
    angularHttpMapper.delete([]).subscribe(val => {
      expect(val).toBe(undefined);
    });
  });

  it('should have a load method', () => {
    angularHttpMapper.load('1').subscribe(val => {
      expect(val).toBe(items[0]);
    });
  });

  it('should have a loadMany method', () => {
    angularHttpMapper.loadMany().subscribe(val => {
      expect(val).toBe(items);
    });
  });
});
