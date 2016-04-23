import { IHttp } from '../interfaces/http';
import { Observable } from 'rxjs/Observable';
export declare class MockHttp implements IHttp {
    private _mockResponse;
    constructor(_mockResponse: any);
    get(url: string, options?: string): Observable<any>;
    post(url: string, body: string, options?: string): Observable<any>;
    put(url: string, body: string, options?: string): Observable<any>;
    delete(url: string, options?: string): Observable<any>;
}
