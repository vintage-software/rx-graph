import { getPropertyName } from './vstack-graph/utilities';

export { BaseGraphService } from './vstack-graph/graph/base-graph.service';
export { ServiceConfig, Relation } from './vstack-graph/graph/graph-utilities';
export { CollectionService } from './vstack-graph/services/collection.service';
export { VsCollectionService } from './vstack-graph/services/vs-collection.service';
export { VsElasticCollectionService } from './vstack-graph/services/vs-elastic-collection.service';
export { VsQueryable } from './vstack-graph/services/vs-queryable';
export { VsElasticQueryable } from './vstack-graph/services/vs-elastic-queryable';
export { LocalCollectionService } from './vstack-graph/services/local.service';
export { AngularHttpMapper } from './vstack-graph/services/angular-http';
export { CollectionItem } from './vstack-graph/utilities';
export * from './vstack-graph/filters';

export const utilities = { getPropertyName };
