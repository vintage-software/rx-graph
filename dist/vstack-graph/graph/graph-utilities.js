"use strict";
var Relation = (function () {
    function Relation(collectionProperty, to, relationId, many) {
        this.collectionProperty = collectionProperty;
        this.to = to;
        this.relationId = relationId;
        this.many = many;
    }
    return Relation;
}());
exports.Relation = Relation;
var ServiceConfig = (function () {
    function ServiceConfig(service, func, relations) {
        this.service = service;
        this.func = func;
        this.relations = relations;
    }
    return ServiceConfig;
}());
exports.ServiceConfig = ServiceConfig;
//# sourceMappingURL=graph-utilities.js.map