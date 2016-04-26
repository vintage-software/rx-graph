"use strict";
(function (ResponseType) {
    ResponseType[ResponseType["basic"] = 0] = "basic";
    ResponseType[ResponseType["cors"] = 1] = "cors";
    ResponseType[ResponseType["default"] = 2] = "default";
    ResponseType[ResponseType["error"] = 3] = "error";
    ResponseType[ResponseType["opaque"] = 4] = "opaque";
    ResponseType[ResponseType["opaqueredirect"] = 5] = "opaqueredirect";
})(exports.ResponseType || (exports.ResponseType = {}));
var ResponseType = exports.ResponseType;
;
//# sourceMappingURL=http.js.map