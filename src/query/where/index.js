import { toTupleList } from '../../util';
import Builder from './builder';

export default class Where {
  constructor(params, options) {
    this.options = options;
    if (typeof params === 'object') {
      params = toTupleList(params);
    }
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
      var builder = Builder.create(...param);
      builder.options = this.options;
      return builder.build(this);
    });
  }
}
