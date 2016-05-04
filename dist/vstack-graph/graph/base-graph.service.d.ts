import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { IServiceConfig } from './graph-utilities';
export declare class BaseGraphService<TGraph> {
    private _serviceConfigs;
    private _debug;
    graph$: Observable<TGraph>;
    constructor(_serviceConfigs: IServiceConfig<TGraph>[]);
    private _slimifyCollection(collection);
    private _collectionItemHasRelation(collectionItem, relation);
    private _toGraph(collection);
    private _mapCollectionItemPropertyFromRelation(collectionItem, collection, relation);
}
