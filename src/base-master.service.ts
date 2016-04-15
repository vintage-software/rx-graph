import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';

import {Dto, IServiceConfig} from './utilities';

export class BaseMasterService<TGraph> {
    private _debug: boolean = true;
    private _master$: BehaviorSubject<any[]>;

    constructor(private _serviceConfigs: IServiceConfig<TGraph>[]) {
        Observable.create()
        this._master$ = new BehaviorSubject<any[]>(this._serviceConfigs.map(i => []));
        let obs$ = this._serviceConfigs[0].service.collection$;
        if (this._serviceConfigs.length > 1) {
            obs$ = obs$.combineLatest(
                this._serviceConfigs.slice(1).map(i => i.service.collection$)
            );
        }
        this._slimify(obs$).subscribe(this._master$);
    }

    get graph$(): Observable<TGraph> {
        return this._toGraph(this._copy(this._master$));
    }

    private _slimify(masterObs: Observable<any>) {
        return masterObs.map(master => {
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

            arr.forEach((value, index) => value && this._serviceConfigs[index].service.updateCollection(value));

            this._debug && console.log('master', master);
            return master;
        });
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
        return masterObs.map(i => i.map(j => j.map(k => Object.assign({}, k))));
    }

    private _toGraph(masterObs: Observable<any>): Observable<TGraph> {
        return masterObs.map(master => {
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
        });
    }
}