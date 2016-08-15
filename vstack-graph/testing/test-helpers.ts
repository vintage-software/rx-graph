import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { BaseGraphService } from './../graph/base-graph.service';
import { ServiceConfig, Relation } from './../graph/graph-utilities';
import { CollectionItem, clone } from './../utilities';
import { VSCollectionService, RemotePersistenceMapper } from './../services/remote.service';

export class MockPersistenceMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
  static mockResponse: any;

  create(items: TItem[]): Observable<TItem[]> {
    return Observable.of(items);
  }

  update(items: TItem[]): Observable<TItem[]> {
    return Observable.of(items);
  }

  delete(ids: any[]): Observable<any[]> {
    return Observable.of(ids);
  }

  load(id: any, options?: string): Observable<TItem> {
    let result = Observable.of(clone(MockPersistenceMapper.mockResponse));
    MockPersistenceMapper.mockResponse = null;
    return result;
  }

  loadMany(options?: string): Observable<TItem[]> {
    let result = Observable.of(clone(MockPersistenceMapper.mockResponse));
    MockPersistenceMapper.mockResponse = null;
    return result;
  }
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

export class TestUserService extends VSCollectionService<TestUser> {
  constructor() {
    super(new MockPersistenceMapper<TestUser>());
  }
}

export class TestPackageService extends VSCollectionService<TestPackage> {
  constructor() {
    super(new MockPersistenceMapper<TestPackage>());
  }
}

export class TestItemService extends VSCollectionService<TestItem> {
  constructor() {
    super(new MockPersistenceMapper<TestItem>());
  }
}

export class TestGraph {
  testUsers: TestUser[];
  testPackages: TestPackage[];
  testItems: TestItem[];
}

export class TestGraphService extends BaseGraphService<TestGraph> {
  constructor(public testUserService: TestUserService,
    public testPackageService: TestPackageService,
    public testItemService: TestItemService) {
    super([
      new ServiceConfig<TestUser, TestGraph>(
        testUserService, (graph, collection) => graph.testUsers = collection, [
          new Relation('testItems', testItemService, 'testUserId', true),
          new Relation('testPackage', testPackageService, 'testPackageId', false)
        ]
      ),
      new ServiceConfig<TestPackage, TestGraph>(
        testPackageService, (graph, collection) => graph.testPackages = collection, [
        ]
      ),
      new ServiceConfig<TestItem, TestGraph>(
        testItemService, (graph, collection) => graph.testItems = collection, [
          new Relation('testUser', testUserService, 'testUserId', false)
        ]
      )
    ]);
  }
}
