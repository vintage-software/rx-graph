import { Observable } from 'rxjs/Observable';
import { RestCollection } from './rest-collection';
export interface Dto {
    id: any;
}
export interface IService {
    collection$: Observable<any[]>;
    updateCollection(items: any[]): void;
}
export interface IServiceConfig<TGraph> {
    service: IService;
    func: (graph: TGraph, collection: any[]) => void;
    mappings: Mapping[];
}
export declare class Mapping {
    collectionProperty: string;
    to: IService;
    mappingId: string;
    many: boolean;
    constructor(collectionProperty: string, to: IService, mappingId: string, many: boolean);
}
export declare class ServiceConfig<TDto extends Dto, TGraph> implements IServiceConfig<TGraph> {
    service: RestCollection<TDto>;
    func: (graph: TGraph, collection: TDto[]) => void;
    mappings: Mapping[];
    constructor(service: RestCollection<TDto>, func: (graph: TGraph, collection: TDto[]) => void, mappings: Mapping[]);
}
