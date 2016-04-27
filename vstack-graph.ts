import {BaseGraphService} from './vstack-graph/graph/base-graph.service';
import {ServiceConfig, Relation} from './vstack-graph/graph/graph-utilities';
import {VSCollectionService, CollectionService} from './vstack-graph/services/remote.service';
import {LocalCollectionService} from './vstack-graph/services/local.service';
import {AngularHttpMapper} from './vstack-graph/services/angular-http';
import {CollectionItem} from './vstack-graph/utilities';

export {
    // Services
    LocalCollectionService,
    CollectionService, 
    VSCollectionService,
    BaseGraphService,
    
    // Helpers
    CollectionItem, ServiceConfig, Relation,
    
    // Mappers
    AngularHttpMapper
    // LocalStorageMapper
    // FirebaseMapper
    // InMemoryMapper
};