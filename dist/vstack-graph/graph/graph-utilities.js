"use strict";
var Mapping = (function () {
    function Mapping(collectionProperty, to, mappingId, many) {
        this.collectionProperty = collectionProperty;
        this.to = to;
        this.mappingId = mappingId;
        this.many = many;
    }
    return Mapping;
}());
exports.Mapping = Mapping;
var ServiceConfig = (function () {
    function ServiceConfig(service, func, mappings) {
        this.service = service;
        this.func = func;
        this.mappings = mappings;
    }
    return ServiceConfig;
}());
exports.ServiceConfig = ServiceConfig;
//# sourceMappingURL=graph-utilities.js.map