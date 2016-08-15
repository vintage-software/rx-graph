"use strict";
require('rxjs/add/operator/skip');
require('rxjs/add/operator/do');
var test_helpers_1 = require('./../testing/test-helpers');
function getTestUsers(include) {
    if (include === void 0) { include = false; }
    var users = [
        { id: 1, value: 'user 1', testPackageId: 1 },
        { id: 2, value: 'user 2', testPackageId: 1 },
        { id: 3, value: 'user 3', testPackageId: 3 },
    ];
    if (include) {
        var items_1 = getTestItems(users);
        users.forEach(function (i) { return i.testItems = items_1.filter(function (j) { return j.testUserId === i.id; }); });
        var packages_1 = getTestPackages();
        users.forEach(function (i) { return i.testPackage = packages_1.find(function (j) { return j.id === i.testPackageId; }); });
    }
    return users;
}
function getTestItems(users) {
    return [
        { id: 1, value: 'item 1', testUserId: users[0].id },
        { id: 2, value: 'item 2', testUserId: users[0].id },
        { id: 3, value: 'item 3', testUserId: users[2].id },
    ];
}
function getTestPackages() {
    return [
        { id: 1, value: 'bronze' },
        { id: 2, value: 'silver' },
        { id: 3, value: 'gold' },
    ];
}
describe('GraphService Specs', function () {
    var testGraphService;
    beforeEach(function () {
        test_helpers_1.MockPersistenceMapper.mockResponse = null;
        testGraphService = new test_helpers_1.TestGraphService(new test_helpers_1.TestUserService(), new test_helpers_1.TestPackageService(), new test_helpers_1.TestItemService());
    });
    it('graph should be initialized to empty', function () {
        var checked = false;
        testGraphService._debug = true;
        testGraphService.graph
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(0);
            expect(graph.testPackages.length).toBe(0);
            expect(graph.testItems.length).toBe(0);
            checked = true;
        })
            .subscribe();
        expect(checked).toBe(true);
    });
    it('create and createMany should be reflected in the graph', function () {
        var checked = false;
        testGraphService.graph
            .skip(2)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(4);
            checked = true;
        })
            .subscribe();
        testGraphService.testUserService.createMany(getTestUsers());
        testGraphService.testUserService.create({ id: 4, value: 'user 4' });
        expect(checked).toBe(true);
    });
    it('get and getMany should be reflected in the graph', function () {
        var checked = false;
        testGraphService.graph
            .skip(2)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(4);
            checked = true;
        })
            .subscribe();
        var users = getTestUsers();
        test_helpers_1.MockPersistenceMapper.mockResponse = users;
        testGraphService.testUserService.getAll().toList();
        test_helpers_1.MockPersistenceMapper.mockResponse = { id: 4, value: 'user 4' };
        testGraphService.testUserService.get(4).toList();
        expect(checked).toBe(true);
    });
    it('update and updateMany should be reflected in the graph', function () {
        var checked = false;
        testGraphService.graph
            .skip(3)
            .do(function (graph) {
            expect(graph.testUsers[0].value).toBe('user 1-changed');
            expect(graph.testUsers[1].value).toBe('user 2-changed');
            expect(graph.testUsers[2].value).toBe('user 3-changed');
            checked = true;
        })
            .subscribe();
        var users = getTestUsers();
        test_helpers_1.MockPersistenceMapper.mockResponse = users;
        testGraphService.testUserService.getAll().toList();
        users.forEach(function (i) { return i.value += '-changed'; });
        testGraphService.testUserService.updateMany([users[0], users[1]]);
        testGraphService.testUserService.update(users[2]);
        expect(checked).toBe(true);
    });
    it('delete and deleteMany should be reflected in the graph', function () {
        var checked = false;
        testGraphService.graph
            .skip(3)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(0);
            checked = true;
        })
            .subscribe();
        var users = getTestUsers();
        test_helpers_1.MockPersistenceMapper.mockResponse = users;
        testGraphService.testUserService.getAll().toList();
        testGraphService.testUserService.deleteMany([users[0].id, users[1].id]);
        testGraphService.testUserService.delete(users[2].id);
        expect(checked).toBe(true);
    });
    it('creating users, then items should link them together', function () {
        var checked = false;
        testGraphService.graph
            .skip(2)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(3);
            expect(graph.testItems.length).toBe(3);
            expect(graph.testUsers[0].testItems.length).toBe(2);
            expect(graph.testUsers[1].testItems.length).toBe(0);
            expect(graph.testUsers[2].testItems.length).toBe(1);
            expect(graph.testUsers[2].testItems[0].testUser).toBe(graph.testUsers[2]);
            checked = true;
        })
            .subscribe();
        testGraphService.testUserService.createMany(getTestUsers())
            .subscribe(function (users) { return testGraphService.testItemService.createMany(getTestItems(users)); });
        expect(checked).toBe(true);
    });
    it('users should have items and packages if they are included in the request', function () {
        var checked = false;
        testGraphService.graph
            .skip(1)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(3);
            expect(graph.testItems.length).toBe(3);
            expect(graph.testUsers[0].testItems.length).toBe(2);
            expect(graph.testUsers[1].testItems.length).toBe(0);
            expect(graph.testUsers[2].testItems.length).toBe(1);
            expect(graph.testUsers[2].testItems[0].testUser).toBe(graph.testUsers[2]);
            expect(graph.testUsers[0].testPackage.value).toBe('bronze');
            expect(graph.testUsers[1].testPackage.value).toBe('bronze');
            expect(graph.testUsers[2].testPackage.value).toBe('gold');
            checked = true;
        })
            .subscribe();
        test_helpers_1.MockPersistenceMapper.mockResponse = getTestUsers(true);
        testGraphService.testUserService.getAll().toList();
        expect(checked).toBe(true);
    });
    it('graph should drop children when no longer present in fk relation', function () {
        var checked = false;
        testGraphService.graph
            .skip(2)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(2);
            expect(graph.testItems.length).toBe(2);
            expect(graph.testUsers[0].testItems.length).toBe(2);
            expect(graph.testUsers[0].testItems[0].value).toBe('item1-changed');
            checked = true;
        })
            .subscribe();
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1, testItems: [{ id: 1, testUserId: 1, value: 'item1' }, { id: 2, testUserId: 1, value: 'item2' }] }];
        testGraphService.testUserService.getAll().toList();
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1, testItems: [{ id: 1, testUserId: 1, value: 'item1-changed' }, { id: 3, testUserId: 1, value: 'item3' }] }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        expect(checked).toBe(true);
    });
    it('graph should drop item when no longer present in get all', function () {
        var checked = false;
        testGraphService.graph
            .skip(2)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(1);
            checked = true;
        })
            .subscribe();
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        expect(checked).toBe(true);
    });
    it('graph should not drop item when no longer present in get request that is not a true get all', function () {
        var checked = false;
        testGraphService.graph
            .skip(2)
            .do(function (graph) {
            expect(graph.testUsers.length).toBe(2);
            checked = true;
        })
            .subscribe();
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }];
        testGraphService.testUserService.getAll().withQueryString('bob').toList();
        expect(checked).toBe(true);
    });
    it('multiple subscribers should be able to get initial and subsequent values', function () {
        var checked = 0;
        var subscribers = 5;
        for (var i = 0; i < subscribers; i++) {
            testGraphService.graph
                .do(function (graph) {
                checked++;
            }).subscribe();
        }
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        test_helpers_1.MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        expect(checked).toBe(subscribers * 3);
    });
});
//# sourceMappingURL=base-graph.service.spec.js.map