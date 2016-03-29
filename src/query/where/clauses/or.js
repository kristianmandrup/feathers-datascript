import { toTupleList } from '../../../util';
import Base from './base';
import Builder from '../builder';

export default class Or extends Base {
  constructor(obj, where) {
    super();
    this._where = where;
    if (!obj.$or) {
      console.error(obj);
      throw 'Or must be an object with an $or key';
    }
    // group each key/value into a list
    this.list = obj.$or;
  }

  // $or: or (either)
  // Simple
  //   {$or: [{name: 'Alice'}, {name: 'Bob'}]}

  // Potentially recursive:
  //   {$or: [{name: {'$ne': 'Alice'}, {age: {'$gte': 21}]}
  build() {
    return {
      ':where': this.where
    };
  }

  get where() {
    return `(or ${this.clauses.join(' ')})`;
  }

  get clauses() {
    return this.list.reduce((prev, next) => {
      return prev.concat(this.clause(next));
    }, []);
  }

  clause(obj) {
    return Builder.create(obj).build(this._where);
  }
}

Or.create = (obj, where) => {
  return new Or(obj, where);
};