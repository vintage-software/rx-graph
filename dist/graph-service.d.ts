import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';
import { IServiceConfig } from './graph-helpers';
export declare class GraphService<TGraph> {
    private _serviceConfigs;
    private _debug;
    graph$: Observable<TGraph>;
    constructor(_serviceConfigs: IServiceConfig<TGraph>[]);
    private _slimify(master);
    private _combine(arr1, arr2);
    private _copy(masterObs);
    private _toGraph(master);
}
