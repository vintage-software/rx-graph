import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import { IServiceConfig } from './utilities';
export declare class GraphService<TGraph> {
    private _serviceConfigs;
    private _debug;
    private _master$;
    constructor(_serviceConfigs: IServiceConfig<TGraph>[]);
    graph$: Observable<TGraph>;
    private _slimify(masterObs);
    private _combine(arr1, arr2);
    private _copy(masterObs);
    private _toGraph(masterObs);
}
