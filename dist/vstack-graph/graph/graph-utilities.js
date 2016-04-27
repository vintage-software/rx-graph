"use strict";
var Relation = (function () {
    function Relation(collectionProperty, to, mappingId, many) {
        this.collectionProperty = collectionProperty;
        this.to = to;
        this.mappingId = mappingId;
        this.many = many;
    }
    return Relation;
}());
exports.Relation = Relation;
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