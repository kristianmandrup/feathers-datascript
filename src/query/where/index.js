import { toTupleList } from '../../util';
import Builder from './builder';

export default class Where {
  constructor(params) {
    if (typeof params === 'object') {
      params = toTupleList(params);
    }
    // console.log('where params', params);
    this.params = params;
    this.values = [];
    this.names = [];
  }

  setValue(param) {
    // ignore Object values
    if (typeof param === 'object') {
      return;
    }
    this.values.push(param);
  }

  setName(name) {
    // ignore non string values
    if (typeof name !== 'string') {
      return;
    }
    this.names.push(name);
  }

  build() {
    return this.params.map(param => {
      return Builder.create(...param).build(this);
    });
  }
}
