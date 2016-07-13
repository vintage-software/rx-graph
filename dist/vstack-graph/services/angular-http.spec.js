"use strict";
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/observable/of');
var angular_http_1 = require('./angular-http');
var mockAngularHttp = {
    post: function () { return Observable_1.Observable.of({ json: function () { return true; } }); },
    put: function () { return Observable_1.Observable.of({ json: function () { return true; } }); },
    delete: function () { return Observable_1.Observable.of(true); },
    get: function () { return Observable_1.Observable.of({ json: function () { return true; } }); }
};
describe('Angular Http Adapter Specs', function () {
    var angularHttpMapper = new angular_http_1.AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });
    beforeEach(function () {
        angularHttpMapper = new angular_http_1.AngularHttpMapper({ baseUrl: '/base/url', http: mockAngularHttp });
    });
    it('should have a create method', function () {
        angularHttpMapper.create([]).subscribe(function (val) {
            expect(val).toBe(true);
        });
    });
    it('should have a update method', function () {
        angularHttpMapper.update([]).subscribe(function (val) {
            expect(val).toBe(true);
        });
    });
    it('should have a delete method', function () {
        angularHttpMapper.delete([]).subscribe(function (val) {
            expect(val).toBe(undefined);
        });
    });
    it('should have a load method', function () {
        angularHttpMapper.load('1').subscribe(function (val) {
            expect(val).toBe(true);
        });
    });
    it('should have a loadMany method', function () {
        angularHttpMapper.loadMany().subscribe(function (val) {
            expect(val).toBe(true);
        });
    });
});
//# sourceMappingURL=angular-http.spec.js.map