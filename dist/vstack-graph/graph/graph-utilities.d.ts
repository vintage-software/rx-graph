import { Observable } from 'rxjs/Observable';
import { RestCollection } from '../rest-collection';
import { CollectionItem } from '../utilities';
export interface IService {
    collection$: Observable<CollectionItem[]>;
    errors$: Observable<any>;
}
export interface IServiceConfig<TGraph> {
    service: IService;
    func: (graph: TGraph, collection: CollectionItem[]) => void;
    mappings: Mapping[];
}
export declare class Mapping {
    collectionProperty: string;
    to: IService;
    mappingId: string;
    many: boolean;
    constructor(collectionProperty: string, to: IService, mappingId: string, many: boolean);
}
export declare class ServiceConfig<TCollectionItem extends CollectionItem, TGraph> implements IServiceConfig<TGraph> {
    service: RestCollection<TCollectionItem>;
    func: (graph: TGraph, collection: TCollectionItem[]) => void;
    mappings: Mapping[];
    constructor(service: RestCollection<TCollectionItem>, func: (graph: TGraph, collection: TCollectionItem[]) => void, mappings: Mapping[]);
}
