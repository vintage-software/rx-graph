"use strict";
var utilities_1 = require('./utilities');
describe('isPrimitive', function () {
    it('should detect primitives', function () {
        expect(utilities_1.isPrimitive('Hello World')).toBe(true);
        expect(utilities_1.isPrimitive(true)).toBe(true);
        expect(utilities_1.isPrimitive(42)).toBe(true);
        expect(utilities_1.isPrimitive(null)).toBe(true);
        expect(utilities_1.isPrimitive(undefined)).toBe(true);
        expect(utilities_1.isPrimitive(new Date())).toBe(true);
        expect(utilities_1.isPrimitive({})).toBe(false);
        expect(utilities_1.isPrimitive([])).toBe(false);
    });
});
describe('slimify', function () {
    it('should be able to slimify objects', function () {
        var complexObject = {
            id: 1,
            name: 'John Doe',
            includedAccounts: ['Visa', 'Mastercard', 'Discover'],
            includedSession: { token: '1234' }
        };
        expect(utilities_1.slimify(complexObject).includedAccounts).toBe(null);
        expect(utilities_1.slimify(complexObject).includedSession).toBe(null);
    });
});
describe('clone', function () {
    it('should be able to clone Dates, Objects and Arrays', function () {
        var testDate = new Date();
        var testObject = { id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] };
        var testArray = [{ id: 1, utcDate: new Date(), accounts: ['Visa', 'Discover'] }, { id: 2, utcDate: new Date(), accounts: ['Visa', 'Discover'] }];
        expect(utilities_1.clone(testDate).getTime()).toBe(testDate.getTime());
        expect(utilities_1.clone(testObject).id).toBe(1);
        expect(utilities_1.clone(testObject).utcDate.getTime()).toBe(testObject.utcDate.getTime());
        expect(utilities_1.clone(testObject).accounts[0]).toBe('Visa');
        expect(utilities_1.clone(testArray).length).toBe(2);
    });
});
describe('mergeCollection', function () {
    it('should merge two collections', function () {
        var collection1 = [{ id: 1, value: 'value 1' }, { id: 2, value: 'value 2' }];
        var collection2 = [{ id: 1, value: 'updated value' }, { id: 3, value: 'value 3' }];
        utilities_1.mergeCollection(collection1, collection2);
        expect(collection1[0].value).toBe('updated value');
        expect(collection1.length).toBe(3);
    });
});
//# sourceMappingURL=utilities.spec.js.map