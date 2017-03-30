import { StoreService } from './store';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

interface ISale {
  name: string;
}

interface IState {
  sales: ISale[];
  org: {
    name: string;
  };
}

class OrgService extends StoreService<IState> {
  constructor() {
    const initialState: IState = {
      sales: [],
      org: { name: 'Bob' }
    };

    super(<IState>initialState);
  }

  updateOrgName(name: string) {
    this.dispatch((state: IState) => {
      const org = { ...state.org, name };
      return { ...state, org };
    });
  }

  addSale(sale: ISale) {
    this.dispatch((state: IState) => {
      return {
        ...state,
        sales: [...state.sales, sale]
      };
    });
  }
}

describe('Store', () => {
  it('should work', done => {
    const orgService = new OrgService();

    orgService.store.select(s => s.org).take(1).subscribe(org => expect(org.name).toBe('Bob'));

    orgService.store
      .select(state => state.org)
      .skip(2)
      .subscribe(o => {
        expect(o.name).toBe('Cory');
        done();
      });

    // orgService.store.select(store => store.sales).subscribe(sales => console.log('Sales: ', sales));
    // orgService.store.select(store => store.org).subscribe(org => console.log('Org: ', org));

    orgService.updateOrgName('John');
    orgService.updateOrgName('Cory');
    orgService.addSale({ name: 'Test Sale' });
  });
});
