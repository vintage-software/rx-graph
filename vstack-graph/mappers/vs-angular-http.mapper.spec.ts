import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AngularHttp } from './angular-http';
import { VsAngularHttpMapper } from './vs-angular-http.mapper';

let getItems = [{ id: 1 }];
let putItems = [{ id: 2 }];
let postItems = [{ id: 3 }];
let patchItems = [{ id: 4 }];

let mockAngularHttp: AngularHttp = {
  get: (url: string) => Observable.of({ text: () => JSON.stringify(url.includes('/1?') ? getItems[0] : getItems), status: 200 }),
  put: () => Observable.of({ text: () => JSON.stringify(putItems), status: 200 }),
  post: () => Observable.of({ text: () => JSON.stringify(postItems), status: 201 }),
  patch: () => Observable.of({ text: () => JSON.stringify(patchItems), status: 200 }),
  delete: () => Observable.of({ status: 204 })
};

describe('Angular Http Adapter Specs', () => {
  let vsAngularHttpMapper = new VsAngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });

  beforeEach(() => {
    vsAngularHttpMapper = new VsAngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });
  });

  it('should have a create method', () => {
    vsAngularHttpMapper.create([], {}).subscribe(val => {
      expect(val).toEqual(postItems);
    });
  });

  it('should have a update method', () => {
    vsAngularHttpMapper.update([], {}).subscribe(val => {
      expect(val).toEqual(putItems);
    });
  });

  it('should have a patch method', () => {
    vsAngularHttpMapper.patch([], {}).subscribe(val => {
      expect(val).toEqual(patchItems);
    });
  });

  it('should have a delete method', () => {
    vsAngularHttpMapper.delete([], {}).subscribe(val => {
      expect(val).toEqual(204);
    });
  });

  it('should have a load method', () => {
    vsAngularHttpMapper.load('1', {}).subscribe(val => {
      expect(val).toEqual(getItems[0]);
    });
  });

  it('should have a loadMany method', () => {
    vsAngularHttpMapper.loadMany({}).subscribe(val => {
      expect(val).toEqual(getItems);
    });
  });
});
