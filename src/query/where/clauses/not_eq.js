import Base from './base';
import Eq from './eq';

export default class NotEq extends Eq {
  // name: 'Alice'
  constructor(...args) {
    super(...args);
  }

  get where() {
    return `(not [${this.clause}])`;
  }
}

NotEq.create = (name, value, where) => {
  if (typeof name === 'object') {
    var key = Object.keys(name)[0];
    value = name[key];
    name = key;
    where = value;
  }
  return new NotEq(name, value, where);
};
