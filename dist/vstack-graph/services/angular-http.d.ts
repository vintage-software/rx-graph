import { RemotePersistenceMapper } from './remote.service';
import { Observable } from 'rxjs/Observable';
import { CollectionItem } from '../utilities';
export declare class AngularHttpMapper<TItem extends CollectionItem> implements RemotePersistenceMapper<TItem> {
    protected baseUrl: string;
    protected requestOptionsArgs: any;
    private http;
    constructor({baseUrl, http, options}: {
        baseUrl: string;
        http: any;
        options?: {};
    });
    create(items: TItem[]): Observable<TItem[]>;
    update(items: TItem[]): Observable<TItem[]>;
    delete(ids: any[]): Observable<any>;
    load(id: string, options?: string): any;
    loadMany(options?: string): any;
}
