import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AngularHttp } from './angular-http';
import { AngularHttpMapper } from './angular-http.mapper';

let getItems = [{ id: 1 }];
let putItems = [{ id: 2 }];
let postItems = [{ id: 3 }];
let patchItems = [{ id: 4 }];

let mockAngularHttp: AngularHttp = {
  get: (url: string) => Observable.of({ json: () => url.endsWith('/1?') ? getItems[0] : getItems, status: 200 }),
  put: () => Observable.of({ json: () => putItems, status: 200 }),
  post: () => Observable.of({ json: () => postItems, status: 201 }),
  patch: () => Observable.of({ json: () => patchItems, status: 200 }),
  delete: () => Observable.of({ status: 204 })
};

describe('Angular Http Adapter Specs', () => {
  let angularHttpMapper = new AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });

  beforeEach(() => {
    angularHttpMapper = new AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });
  });

  it('should have a create method', () => {
    angularHttpMapper.create([], {}).subscribe(val => {
      expect(val).toBe(postItems);
    });
  });

  it('should have a update method', () => {
    angularHttpMapper.update([], {}).subscribe(val => {
      expect(val).toBe(putItems);
    });
  });

  it('should have a patch method', () => {
    angularHttpMapper.patch([], {}).subscribe(val => {
      expect(val).toBe(patchItems);
    });
  });

  it('should have a delete method', () => {
    angularHttpMapper.delete([], {}).subscribe(val => {
      expect(val).toBe(204);
    });
  });

  it('should have a load method', () => {
    angularHttpMapper.load('1', {}).subscribe(val => {
      expect(val).toBe(getItems[0]);
    });
  });

  it('should have a loadMany method', () => {
    angularHttpMapper.loadMany({}).subscribe(val => {
      expect(val).toBe(getItems);
    });
  });
});
