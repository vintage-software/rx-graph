import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { IServiceConfig } from './graph-utilities';
export declare class BaseGraphService<TGraph> {
    private serviceConfigs;
    graph: Observable<TGraph>;
    constructor(serviceConfigs: IServiceConfig<TGraph>[]);
    private slimifyCollection(collection);
    private collectionItemHasRelation(collectionItem, relation);
    private toGraph(collection);
    private mapCollectionItemPropertyFromRelation(collectionItem, collection, relation);
}
