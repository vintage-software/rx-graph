import { Observable } from 'rxjs/Observable';
import { LocalCollectionService } from '../services/local.service';
import { CollectionItem } from '../utilities';
export interface IService {
    collection$: Observable<CollectionItem[]>;
    errors$: Observable<any>;
}
export interface IServiceConfig<TGraph> {
    service: IService;
    func: (graph: TGraph, collection: CollectionItem[]) => void;
    relations: Relation[];
}
export declare class Relation {
    collectionProperty: string;
    to: IService;
    relationId: string;
    many: boolean;
    constructor(collectionProperty: string, to: IService, relationId: string, many: boolean);
}
export declare class ServiceConfig<TCollectionItem extends CollectionItem, TGraph> implements IServiceConfig<TGraph> {
    service: LocalCollectionService<TCollectionItem>;
    func: (graph: TGraph, collection: TCollectionItem[]) => void;
    relations: Relation[];
    constructor(service: LocalCollectionService<TCollectionItem>, func: (graph: TGraph, collection: TCollectionItem[]) => void, relations: Relation[]);
}
