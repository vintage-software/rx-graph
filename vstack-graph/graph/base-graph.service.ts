import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/do';

import 'rxjs/Rx'; //TODO: we just want combineLatest

import {CollectionItem, clone, mergeCollection} from '../utilities';
import {IServiceConfig} from './graph-utilities';

export class BaseGraphService<TGraph> {
    private _debug: boolean = false;
    graph$: Observable<TGraph>;

    constructor(private _serviceConfigs: IServiceConfig<TGraph>[]) {
        this.graph$ = Observable
            .combineLatest(this._serviceConfigs.map(i => (<any>i.service)._collection$))
            .map(i => this._slimify(i))
            .share()
            .map(i => i.map(array => clone(array)))
            .map(i => this._toGraph(i));
    }

    private _slimify(master: any[]) {
        let changes = true;
        while (changes === true) {
            changes = false;
            this._serviceConfigs.forEach((serviceConfig, index) => {
                serviceConfig.mappings.forEach(mapping =>
                    master[index].forEach(dto => {
                        let mappingService = this._serviceConfigs.find(i => i.service === mapping.to);
                        let mappingIndex = this._serviceConfigs.indexOf(mappingService);
                        let toUpdate = [];
                        if (!!dto[mapping.collectionProperty]) {
                            changes = true;
                            if (mapping.many) {
                                toUpdate = dto[mapping.collectionProperty];
                            } else {
                                toUpdate.push(dto[mapping.collectionProperty]);
                            }
                            dto[mapping.collectionProperty] = null;
                            mergeCollection(master[mappingIndex], toUpdate);
                            master[mappingIndex] = master[mappingIndex].filter(i => i[mapping.mappingId] !== dto.id || toUpdate.find(j => j.id === i.id));
                        }
                    })
                );
            });
        }

        this._debug && console.log('master', master);
        return master;
    }

    private _toGraph(master: any[]): TGraph {
        let graph = <TGraph>{};

        this._serviceConfigs.forEach((serviceConfig, index) => {
            serviceConfig.mappings.forEach(mapping =>
                master[index].forEach(dto => {
                    let mappingService = this._serviceConfigs.find(i => i.service === mapping.to);
                    let mappingIndex = this._serviceConfigs.indexOf(mappingService);
                    if (mapping.many) {
                        dto[mapping.collectionProperty] = master[mappingIndex].filter(i => i[mapping.mappingId] === dto.id);
                    } else {
                        dto[mapping.collectionProperty] = master[mappingIndex].find(i => i.id === dto[mapping.mappingId]);
                    }
                })
            );

            serviceConfig.func(graph, master[index]);
        });

        return graph;
    }
}