"use strict";
var AngularHttpMapper = (function () {
    function AngularHttpMapper(_a) {
        var baseUrl = _a.baseUrl, http = _a.http, options = _a.options;
        this._baseUrl = baseUrl;
        this._requestOptionsArgs = options;
        this._http = http;
    }
    AngularHttpMapper.prototype.create = function (items) {
        return this._http.post(this._baseUrl + "/bulk", JSON.stringify(items), Object.assign({}, this._requestOptionsArgs)).map(function (res) { return res.json(); });
    };
    AngularHttpMapper.prototype.update = function (items) {
        return this._http.put(this._baseUrl + "/bulk", JSON.stringify(items), Object.assign({}, this._requestOptionsArgs)).map(function (res) { return res.json(); });
    };
    AngularHttpMapper.prototype.delete = function (ids) {
        return this._http.delete(this._baseUrl + "?ids=" + ids.join(), Object.assign({}, this._requestOptionsArgs)).map(function (res) { return res.status; });
    };
    AngularHttpMapper.prototype.load = function (id, options) {
        if (options === void 0) { options = ''; }
        return this._http.get(this._baseUrl + "/" + id, Object.assign({}, this._requestOptionsArgs, options)).map(function (res) { return res.json(); });
    };
    AngularHttpMapper.prototype.loadMany = function (options) {
        if (options === void 0) { options = ''; }
        return this._http.get(this._baseUrl, Object.assign({}, this._requestOptionsArgs, options)).map(function (res) { return res.json(); });
    };
    return AngularHttpMapper;
}());
exports.AngularHttpMapper = AngularHttpMapper;
//# sourceMappingURL=angular-http.js.map