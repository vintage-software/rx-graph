import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { pluck } from 'rxjs/operator/pluck';
import { map } from 'rxjs/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/share';

export interface Store<T> extends Observable<T> {
  // tslint:disable
  select<K>(mapFn: (state: T) => K): BehaviorSubject<K>;
  select<a extends keyof T>(key: a): BehaviorSubject<T[a]>;
  select<a extends keyof T, b extends keyof T[a]>(key1: a, key2: b): BehaviorSubject<T[a][b]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(key1: a, key2: b, key3: c): BehaviorSubject<T[a][b][c]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(key1: a, key2: b, key3: c, key4: d): BehaviorSubject<T[a][b][c][d]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(key1: a, key2: b, key3: c, key4: d, key5: e): BehaviorSubject<T[a][b][c][d][e]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d], f extends keyof T[a][b][c][d][e]>(key1: a, key2: b, key3: c, key4: d, key5: e, key6: f): BehaviorSubject<T[a][b][c][d][e][f]>
  select(pathOrMapFn: ((state: T) => any) | string, ...paths: string[]): BehaviorSubject<any>;
  // tslint:enable
};

export class StoreSubject<T> extends BehaviorSubject<T> {
  constructor(state: any) {
    super(state);
    this.source = state;
  }

  // tslint:disable
  select<K>(mapFn: (state: T) => K): StoreSubject<K>;
  select<a extends keyof T>(key: a): StoreSubject<T[a]>;
  select<a extends keyof T, b extends keyof T[a]>(key1: a, key2: b): StoreSubject<T[a][b]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(key1: a, key2: b, key3: c): StoreSubject<T[a][b][c]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(key1: a, key2: b, key3: c, key4: d): StoreSubject<T[a][b][c][d]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(key1: a, key2: b, key3: c, key4: d, key5: e): StoreSubject<T[a][b][c][d][e]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d], f extends keyof T[a][b][c][d][e]>(key1: a, key2: b, key3: c, key4: d, key5: e, key6: f): StoreSubject<T[a][b][c][d][e][f]>
  // tslint:enable
  select(pathOrMapFn: ((state: T) => any) | string, ...paths: string[]): StoreSubject<any> {
    let mapped$: StoreSubject<any>;

    if (typeof pathOrMapFn === 'string') {
      mapped$ = pluck.call(this, pathOrMapFn, ...paths);
    } else if (typeof pathOrMapFn === 'function') {
      mapped$ = map.call(this, pathOrMapFn);
    } else {
      throw new TypeError(`Unexpected type '${typeof pathOrMapFn}' in select operator,`
        + ` expected 'string' or 'function'`);
    }

    return distinctUntilChanged.call(mapped$);
  }

  lift(operator): StoreSubject<T> {
    const observable = new StoreSubject<T>(this);
    observable.source = this;
    observable.operator = operator;
    return observable;
  }
}

export class StoreService<T> {
  store: Store<T>;

  constructor(initialState: T) {
    this.store = new StoreSubject<T>(initialState);
  }

  protected dispatch(reducer: ((state: T) => T)) {
    (<StoreSubject<T>>this.store).next(reducer((<StoreSubject<T>>this.store).getValue()));
  }
}
