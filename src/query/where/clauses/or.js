import Base from './base';
import Builder from '../builder';

export default class Or extends Base {
  constructor(obj) {
    super();
    if (!obj.$or) {
      console.error(obj);
      throw 'Or must be an object with an $or key';
    }
    // group each key/value into a list

    this.list = Object.keys(obj.$or).map(key => {
      return [key, obj.$or[key]];
    });
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
    console.log('clauses', this.clauses);
    return `(or ${this.clauses.join(' ')})`;
  }

  get clauses() {
    return this.list.reduce((prev, next) => {
      return prev.concat(this.clause(next));
    }, []);
  }

  clause(obj) {
    console.log('clause for', obj);
    return new Builder(...obj).build();
  }
}

Or.create = (obj) => {
  return new Or(obj);
};