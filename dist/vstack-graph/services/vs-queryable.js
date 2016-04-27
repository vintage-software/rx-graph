"use strict";
var VsQueryable = (function () {
    function VsQueryable(_load) {
        this._load = _load;
    }
    VsQueryable.prototype.getQueryString = function () {
        return this._queryString;
    };
    VsQueryable.prototype.toList = function () {
        var qs = this.getQueryString();
        var isLoadAll = !!!qs;
        return this._load(isLoadAll, qs);
    };
    VsQueryable.prototype.withQueryString = function (queryString) {
        this._queryString = queryString;
        return this;
    };
    return VsQueryable;
}());
exports.VsQueryable = VsQueryable;
//# sourceMappingURL=vs-queryable.js.map