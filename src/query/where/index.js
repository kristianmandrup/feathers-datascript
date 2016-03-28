import { toTupleList } from '../../util';
import Builder from './builder';

export default class Where {
  constructor(params) {
    if (typeof params === 'object') {
      params = toTupleList(params);
    }
    console.log('where params', params);
    this.params = params;
  }

  build() {
    return this.params.map(param => {
      return new Builder(param).build();
    });
  }
}
