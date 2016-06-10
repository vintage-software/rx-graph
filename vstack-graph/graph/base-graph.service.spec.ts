/// <reference path="../../typings/browser/ambient/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/browser/ambient/es6-shim/es6-shim.d.ts" />

import {Observable} from 'rxjs/Observable';

import {MockPersistenceMapper, TestGraphService, TestUserService, TestPackageService, TestItemService} from './../testing/test-helpers';

function getTestUsers(include: boolean = false): any[] {
    let users: any[] = [
        { id: 1, value: 'user 1', testPackageId: 1 },
        { id: 2, value: 'user 2', testPackageId: 1 },
        { id: 3, value: 'user 3', testPackageId: 3 },
    ];

    if (include) {
        let items = getTestItems(users);
        users.forEach(i => i.testItems = items.filter(j => j.testUserId === i.id));

        let packages = getTestPackages();
        users.forEach(i => i.testPackage = packages.find(j => j.id === i.testPackageId));
    }

    return users;
}

function getTestItems(users: any[]): any[] {
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

describe('GraphService Specs', () => {
    let testGraphService: TestGraphService;

    beforeEach(() => {
        MockPersistenceMapper.mockResponse = null;
        testGraphService = new TestGraphService(new TestUserService(), new TestPackageService(), new TestItemService());
    });

    it('graph should be initialized to empty', () => {
        let checked = false;
        (<any>testGraphService)._debug = true; // run under debug once to get full code coverage :)

        testGraphService.graph$
            .do(graph => {
                expect(graph.testUsers.length).toBe(0);
                expect(graph.testPackages.length).toBe(0);
                expect(graph.testItems.length).toBe(0);
                checked = true;
            })
            .subscribe();

        expect(checked).toBe(true);
    });

    it('create and createMany should be reflected in the graph', () => {
        let checked = false;

        testGraphService.graph$
            .skip(2)
            .do(graph => {
                expect(graph.testUsers.length).toBe(4);
                checked = true;
            })
            .subscribe();

        testGraphService.testUserService.createMany(getTestUsers());
        testGraphService.testUserService.create({ id: 4, value: 'user 4' });

        expect(checked).toBe(true);
    });

    it('get and getMany should be reflected in the graph', () => {
        let checked = false;

        testGraphService.graph$
            .skip(2)
            .do(graph => {
                expect(graph.testUsers.length).toBe(4);
                checked = true;
            })
            .subscribe();

        let users = getTestUsers();
        MockPersistenceMapper.mockResponse = users;
        testGraphService.testUserService.getAll().toList();
        MockPersistenceMapper.mockResponse = { id: 4, value: 'user 4' };
        testGraphService.testUserService.get(4).toList();

        expect(checked).toBe(true);
    });

    it('update and updateMany should be reflected in the graph', () => {
        let checked = false;

        testGraphService.graph$
            .skip(3)
            .do(graph => {
                expect(graph.testUsers[0].value).toBe('user 1-changed');
                expect(graph.testUsers[1].value).toBe('user 2-changed');
                expect(graph.testUsers[2].value).toBe('user 3-changed');
                checked = true;
            })
            .subscribe();

        let users = getTestUsers();
        MockPersistenceMapper.mockResponse = users;
        testGraphService.testUserService.getAll().toList();
        users.forEach(i => i.value += '-changed');
        testGraphService.testUserService.updateMany([users[0], users[1]]);
        testGraphService.testUserService.update(users[2]);

        expect(checked).toBe(true);
    });

    it('delete and deleteMany should be reflected in the graph', () => {
        let checked = false;

        testGraphService.graph$
            .skip(3)
            .do(graph => {
                expect(graph.testUsers.length).toBe(0);
                checked = true;
            })
            .subscribe();

        let users = getTestUsers();
        MockPersistenceMapper.mockResponse = users;
        testGraphService.testUserService.getAll().toList();
        testGraphService.testUserService.deleteMany([users[0].id, users[1].id]);
        testGraphService.testUserService.delete(users[2].id);

        expect(checked).toBe(true);
    });

    it('creating users, then items should link them together', () => {
        let checked = false;

        testGraphService.graph$
            .skip(2)
            .do(graph => {
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
            .subscribe(users => testGraphService.testItemService.createMany(getTestItems(users)));

        expect(checked).toBe(true);
    });

    it('users should have items and packages if they are included in the request', () => {
        let checked = false;

        testGraphService.graph$
            .skip(1)
            .do(graph => {
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

        MockPersistenceMapper.mockResponse = getTestUsers(true);
        testGraphService.testUserService.getAll().toList();

        expect(checked).toBe(true);
    });

    it('graph should drop children when no longer present in fk relation', () => {
        let checked = false;

        testGraphService.graph$
            .skip(2)
            .do(graph => {
                expect(graph.testUsers.length).toBe(2);
                expect(graph.testItems.length).toBe(2);
                expect(graph.testUsers[0].testItems.length).toBe(2);
                expect(graph.testUsers[0].testItems[0].value).toBe('item1-changed');
                checked = true;
            })
            .subscribe();

        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1, testItems: [{ id: 1, testUserId: 1, value: 'item1' }, { id: 2, testUserId: 1, value: 'item2' }] }];
        testGraphService.testUserService.getAll().toList();
        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1, testItems: [{ id: 1, testUserId: 1, value: 'item1-changed' }, { id: 3, testUserId: 1, value: 'item3' }] }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();

        expect(checked).toBe(true);
    });

    it('graph should drop item when no longer present in get all', () => {
        let checked = false;

        testGraphService.graph$
            .skip(2)
            .do(graph => {
                expect(graph.testUsers.length).toBe(1);
                checked = true;
            })
            .subscribe();

        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();

        expect(checked).toBe(true);
    });

    it('graph should not drop item when no longer present in get request that is not a true get all', () => {
        let checked = false;

        testGraphService.graph$
            .skip(2)
            .do(graph => {
                expect(graph.testUsers.length).toBe(2);
                checked = true;
            })
            .subscribe();

        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();
        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }];
        testGraphService.testUserService.getAll().withQueryString('bob').toList();

        expect(checked).toBe(true);
    });

    it('multiple subscribers should be able to get initial and subsequent values', () => {
        let checked = 0;

        let subscribers = 5;

        for (let i = 0; i < subscribers; i++) {
            testGraphService.graph$
                .do(graph => {
                    checked++;
                }).subscribe();
        }

        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }, { id: 2, value: 'user 2', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();

        MockPersistenceMapper.mockResponse = [{ id: 1, value: 'user 1', testPackageId: 1 }];
        testGraphService.testUserService.getAll().toList();

        expect(checked).toBe(subscribers * 3);
    });
});