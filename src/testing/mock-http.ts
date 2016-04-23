import {IHttp} from '../interfaces/http';
import {Observable} from 'rxjs/Observable';

export class MockHttp implements IHttp {
    constructor(private _mockResponse: any) {
        
    }
    
    get(url: string, options = '') {
        return Observable.of(this._mockResponse);
    }
    
    post(url: string, body: string, options = '') {
        return Observable.of(this._mockResponse);
    }
    
    put(url: string, body: string, options = '') {
        return Observable.of(this._mockResponse);
    }
    
    delete(url: string, options = '') {
        return Observable.of(this._mockResponse);
    }
}