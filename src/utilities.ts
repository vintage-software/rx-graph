import { Observable, } from 'rxjs/Observable';
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

export class Mapping {
  constructor(public collectionProperty: string, public to: IService, public mappingId: string, public many: boolean) {

  }
}

export class ServiceConfig<TDto extends Dto, TGraph> implements IServiceConfig<TGraph> {
  constructor(public service: RestCollection<TDto>, public func: (graph: TGraph, collection: TDto[]) => void, public mappings: Mapping[]) {

  }
}