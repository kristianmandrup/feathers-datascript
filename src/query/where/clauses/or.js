import BaseClause from './base-clause';
import Builder from '../builder';

export default class Or extends BaseClause {
  constructor(obj) {
    this.list = obj['$or'];
  }

  // $or: or (either)
  // Simple
  //   {$or: [{name: 'Alice'}, {name: 'Bob'}]}

  // Potentially recursive:
  //   {$or: [{name: {'$ne': 'Alice'}, {age: {'$gte': 21}]}
  build() {
    return `(or ${this.clauses()})`;
  }

  clauses() {
    this.list.reduce((prev, next) => {
      prev.push(this.clause(next));
      return prev;
    }, [])
  }


  clause(obj) {
    new Builder(obj);
  }
}