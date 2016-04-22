import {IHttp} from '../utilities';
import {Observable} from 'rxjs/Observable';

class MockHttp implements IHttp<any> {  
    constructor() {
        
    }
    
    get(url: string, options = '') {
        return Observable.of(1);
    }
    
    post(url: string, options = '') {
        return Observable.of(1);
    }
    
    put(url: string, options = '') {
        return Observable.of(1);
    }
    
    delete(url: string, options = '') {
        return Observable.of(1);
    }
}