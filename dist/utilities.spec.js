"use strict";
var testing_1 = require('angular2/testing');
var utilities_1 = require('./utilities');
testing_1.describe('Utilities Specs', function () {
    testing_1.it('should detect primitives', function () {
        testing_1.expect(utilities_1.isPrimitive('Hello World')).toBe(true);
        testing_1.expect(utilities_1.isPrimitive(true)).toBe(true);
        testing_1.expect(utilities_1.isPrimitive(42)).toBe(true);
        testing_1.expect(utilities_1.isPrimitive(null)).toBe(true);
        testing_1.expect(utilities_1.isPrimitive(undefined)).toBe(true);
        testing_1.expect(utilities_1.isPrimitive(new Date())).toBe(true);
        testing_1.expect(utilities_1.isPrimitive({})).toBe(false);
        testing_1.expect(utilities_1.isPrimitive([])).toBe(false);
    });
});
//# sourceMappingURL=utilities.spec.js.map