"use strict";
var AngularHttpMapper = (function () {
    function AngularHttpMapper(_a) {
        var baseUrl = _a.baseUrl, http = _a.http, options = _a.options;
        this.baseUrl = baseUrl;
        this.requestOptionsArgs = options;
        this.http = http;
    }
    AngularHttpMapper.prototype.create = function (items) {
        return this.http.post(this.baseUrl + "/bulk", JSON.stringify(items), this.requestOptionsArgs).map(function (res) { return res.json(); });
    };
    AngularHttpMapper.prototype.update = function (items) {
        return this.http.put(this.baseUrl + "/bulk", JSON.stringify(items), this.requestOptionsArgs).map(function (res) { return res.json(); });
    };
    AngularHttpMapper.prototype.delete = function (ids) {
        return this.http.delete(this.baseUrl + "?ids=" + ids.join(), this.requestOptionsArgs).map(function (res) { return res.status; });
    };
    AngularHttpMapper.prototype.load = function (id, options) {
        if (options === void 0) { options = ''; }
        return this.http.get(this.baseUrl + "/" + id + "?" + options, this.requestOptionsArgs).map(function (res) { return res.json(); });
    };
    AngularHttpMapper.prototype.loadMany = function (options) {
        if (options === void 0) { options = ''; }
        return this.http.get(this.baseUrl + "?" + options, this.requestOptionsArgs).map(function (res) { return res.json(); });
    };
    return AngularHttpMapper;
}());
exports.AngularHttpMapper = AngularHttpMapper;
//# sourceMappingURL=angular-http.js.map