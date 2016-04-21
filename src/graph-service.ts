import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/Rx'; //TODO: we just want combineLatest

import {CollectionItem, clone} from './utilities';
import {IServiceConfig} from './graph-helpers';

export class GraphService<TGraph> {
    private _debug: boolean = true;
    graph$: Observable<TGraph>;

    constructor(private _serviceConfigs: IServiceConfig<TGraph>[]) {
        this.graph$ = Observable
            .combineLatest(this._serviceConfigs.map(i => i.service.collection$))
            .map(i => this._slimify(i))
            // .share()
            // .startWith(this._serviceConfigs.map(i => []))
            .map(i => i.map(array => clone(array)))
            .map(i => this._toGraph(i));

        // this._serviceConfigs[0].service['_collection$'];
        // if (this._serviceConfigs.length > 1) {
        //     _master$ = _master$.combineLatest(
        //         this._serviceConfigs.slice(1).map(i => i.service.collection$)
        //     );
        // }
        // _master$ = _master$
    }

    private _slimify(master: any[]) {
        let arr = [];
        let changes = true;
        while (changes === true) {
            changes = false;
            this._serviceConfigs.forEach((serviceConfig, index) => {
                serviceConfig.mappings.forEach(mapping =>
                    master[index].forEach(dto => {
                        let mappingService = this._serviceConfigs.find(i => i.service === mapping.to);
                        let mappingIndex = this._serviceConfigs.indexOf(mappingService);
                        let toUpdate = [];
                        if (dto[mapping.collectionProperty] !== null) {
                            changes = true;
                            if (mapping.many) {
                                toUpdate = dto[mapping.collectionProperty] || [];
                            } else {
                                toUpdate.push(dto[mapping.collectionProperty]);
                            }
                            dto[mapping.collectionProperty] = null;
                            arr[mappingIndex] = arr[mappingIndex] ? arr[mappingIndex].concat(toUpdate) : toUpdate;
                            master[mappingIndex] = this._combine(master[mappingIndex], toUpdate);
                        }
                    })
                );
            });
        }

        //arr.forEach((value, index) => value && this._serviceConfigs[index].service._dangerousGraphUpdateCollection(value));

        this._debug && console.log('master', master);
        return master;
    }

    private _combine(arr1: any[], arr2: any[]) {
        let arr: any[] = arr1.slice();
        arr2.forEach(i => {
            if (arr.find(j => j.id === i.id) === undefined) {
                arr.push(i);
            }
        });
        return arr;
    }

    private _copy(masterObs: Observable<any>) {
        return masterObs.map(arrays => clone(arrays));
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