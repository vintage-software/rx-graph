import { Observable } from 'rxjs/Observable';
import { BaseGraphService } from './../graph/base-graph.service';
import { CollectionItem } from './../utilities';
import { VSCollectionService, RemotePersistenceMapper } from './../services/remote.service';
export declare class MockPersistenceMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
    static mockResponse: any;
    create(items: TItem[]): Observable<TItem[]>;
    update(items: TItem[]): Observable<TItem[]>;
    delete(ids: any[]): Observable<any[]>;
    load(id: any, options?: string): Observable<TItem>;
    loadMany(options?: string): Observable<TItem[]>;
}
export interface TestUser {
    id: any;
    value: string;
    testPackageId: any;
    testItems: TestItem[];
    testPackage: TestPackage;
}
export interface TestPackage {
    id: any;
    value: string;
}
export interface TestItem {
    id: any;
    value: string;
    testUserId: any;
    testUser: TestUser;
}
export declare class TestUserService extends VSCollectionService<TestUser> {
    constructor();
}
export declare class TestPackageService extends VSCollectionService<TestPackage> {
    constructor();
}
export declare class TestItemService extends VSCollectionService<TestItem> {
    constructor();
}
export declare class TestGraph {
    testUsers: TestUser[];
    testPackages: TestPackage[];
    testItems: TestItem[];
}
export declare class TestGraphService extends BaseGraphService<TestGraph> {
    testUserService: TestUserService;
    testPackageService: TestPackageService;
    testItemService: TestItemService;
    constructor(testUserService: TestUserService, testPackageService: TestPackageService, testItemService: TestItemService);
}
