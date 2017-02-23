import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { BaseGraphService } from './../graph/base-graph.service';
import { ServiceConfig, Relation } from './../graph/graph-utilities';
import { CollectionItem, deepClone, Id } from './../utilities';
import { RemotePersistenceMapper } from './../services/remote.service';
import { VsCollectionService } from './../services/vs-collection.service';

export class MockPersistenceMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
  static mockResponse: any;

  create(items: TItem[]): Observable<TItem[]> {
    return Observable.of(items);
  }

  update(items: TItem[]): Observable<TItem[]> {
    return Observable.of(items);
  }

  patch(items: TItem[]): Observable<TItem[]> {
    return Observable.of(items);
  }

  delete(ids: Id[]): Observable<any[]> {
    return Observable.of(ids);
  }

  load(id: Id, options?: string): Observable<TItem> {
    let result = Observable.of(deepClone(MockPersistenceMapper.mockResponse));
    MockPersistenceMapper.mockResponse = null;
    return result;
  }

  loadMany(options?: string): Observable<TItem[]> {
    let result = Observable.of(deepClone(MockPersistenceMapper.mockResponse));
    MockPersistenceMapper.mockResponse = null;
    return result;
  }
}

export interface TestUser {
  id: Id;
  value: string;
  testPackageId: Id;
  testItems: TestItem[];
  testPackage: TestPackage;
}

export interface TestPackage {
  id: Id;
  value: string;
}

export interface TestItem {
  id: Id;
  value: string;
  testUserId: Id;
  testUser: TestUser;
}

export class TestUserService extends VsCollectionService<TestUser> {
  constructor() {
    super(new MockPersistenceMapper<TestUser>());
  }
}

export class TestPackageService extends VsCollectionService<TestPackage> {
  constructor() {
    super(new MockPersistenceMapper<TestPackage>());
  }
}

export class TestItemService extends VsCollectionService<TestItem> {
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
