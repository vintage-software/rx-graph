import {Observable} from 'rxjs/Observable';

import {LocalCollectionService} from '../services/local.service';
import {CollectionItem} from '../utilities';

export interface IService {
    collection$: Observable<CollectionItem[]>;
    errors$: Observable<any>;
}

export interface IServiceConfig<TGraph> {
    service: IService;
    func: (graph: TGraph, collection: CollectionItem[]) => void;
    mappings: Relation[];
}

export class Relation {
    constructor(public collectionProperty: string, public to: IService, public mappingId: string, public many: boolean) { }
}

export class ServiceConfig<TCollectionItem extends CollectionItem, TGraph> implements IServiceConfig<TGraph> {
    constructor(public service: LocalCollectionService<TCollectionItem>, public func: (graph: TGraph, collection: TCollectionItem[]) => void, public mappings: Relation[]) { }
}