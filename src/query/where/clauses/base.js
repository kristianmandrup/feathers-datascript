import PredicateClause, { predicateMap } from './predicate-clause';
import EqClause from './eq-clause';
import OrClause from './or-clause';

export default class BaseClause {
  constructor(name) {
    this.name = name;
  }

  build() {
    throw 'build must be implemented by subclass';
  }
}


