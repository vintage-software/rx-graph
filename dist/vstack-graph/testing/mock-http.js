"use strict";
var Observable_1 = require('rxjs/Observable');
var MockHttp = (function () {
    function MockHttp(_mockResponse) {
        this._mockResponse = _mockResponse;
    }
    MockHttp.prototype.get = function (url, options) {
        if (options === void 0) { options = ''; }
        return Observable_1.Observable.of(this._mockResponse);
    };
    MockHttp.prototype.post = function (url, body, options) {
        if (options === void 0) { options = ''; }
        return Observable_1.Observable.of(this._mockResponse);
    };
    MockHttp.prototype.put = function (url, body, options) {
        if (options === void 0) { options = ''; }
        return Observable_1.Observable.of(this._mockResponse);
    };
    MockHttp.prototype.delete = function (url, options) {
        if (options === void 0) { options = ''; }
        return Observable_1.Observable.of(this._mockResponse);
    };
    MockHttp.prototype.setMockResponse = function (response) {
        this._mockResponse = response;
    };
    return MockHttp;
}());
exports.MockHttp = MockHttp;
//# sourceMappingURL=mock-http.js.map