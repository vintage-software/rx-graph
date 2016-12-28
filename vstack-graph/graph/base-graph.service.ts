import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/share';

import { CollectionItem, deepClone, mergeCollection } from '../utilities';
import { IServiceConfig, Relation } from './graph-utilities';

export class BaseGraphService<TGraph> {
  graph: Observable<TGraph>;
  history: Observable<{ state: {}, action: string }>;

  constructor(private serviceConfigs: IServiceConfig<TGraph>[]) {
    let graph = new BehaviorSubject<TGraph>(null);
    let history = new BehaviorSubject<{ state: any, action: string }>({ state: null, action: 'INIT_GRAPH' });

    Observable
      .combineLatest(this.serviceConfigs.map(i => (<any>i.service)._collection))
      .map(i => this.slimifyCollection(i).map(array => deepClone(array))).map(i => this.toGraph(i))
      .subscribe(g => graph.next(g));

    this.graph = graph;

    Observable.combineLatest(
      Observable.merge(...this.serviceConfigs.map(i => (i.service).history)),
      this.graph, (h, g) => {
        return { state: g, action: h[h.length - 1].action };
      }).subscribe(h => history.next(h));

    this.history = history;
  }

  private slimifyCollection(collection: any[]) {
    let changes = true;
    while (changes === true) {
      changes = false;

      this.serviceConfigs.forEach((serviceConfig, index) => {
        serviceConfig.relations.forEach((relation: Relation) =>
          collection[index].forEach((collectionItem: CollectionItem) => {
            let mappingService = this.serviceConfigs.find(i => i.service === relation.to);
            let mappingIndex = this.serviceConfigs.indexOf(mappingService);
            let collectionItemsToUpdate = [];

            if (this.collectionItemHasRelation(collectionItem, relation)) {
              changes = true;

              if (relation.many) {
                collectionItemsToUpdate = collectionItem[relation.collectionProperty];
              } else {
                collectionItemsToUpdate.push(collectionItem[relation.collectionProperty]);
              }

              collectionItem[relation.collectionProperty] = null;
              mergeCollection(collection[mappingIndex], collectionItemsToUpdate);

              collection[mappingIndex] = collection[mappingIndex].filter(i => {
                return i[relation.relationId] !== collectionItem.id || collectionItemsToUpdate.find(j => j.id === i.id);
              });
            }
          })
        );
      });
    }

    return collection;
  }

  private collectionItemHasRelation(collectionItem: CollectionItem, relation: Relation) {
    return !!collectionItem[relation.collectionProperty];
  }

  private toGraph(collection: any[]): TGraph {
    let graph = <TGraph>{};

    this.serviceConfigs.forEach((serviceConfig, index) => {
      serviceConfig.relations.forEach((relation: Relation) =>
        collection[index].forEach((collectionItem: CollectionItem) => {
          this.mapCollectionItemPropertyFromRelation(collectionItem, collection, relation);
        })
      );

      serviceConfig.func(graph, collection[index]);
    });

    return graph;
  }

  private mapCollectionItemPropertyFromRelation(collectionItem: CollectionItem, collection: any[], relation: Relation) {
    let mappingService = this.serviceConfigs.find(i => i.service === relation.to);
    let mappingIndex = this.serviceConfigs.indexOf(mappingService);

    if (relation.many) {
      collectionItem[relation.collectionProperty] = collection[mappingIndex].filter(i => i[relation.relationId] === collectionItem.id);
    } else {
      collectionItem[relation.collectionProperty] = collection[mappingIndex].find(i => i.id === collectionItem[relation.relationId]);
    }
  }
}
