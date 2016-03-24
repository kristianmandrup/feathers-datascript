  // let predKeys = Object.keys(predicates);
  // let predicateFuns = Object.keys(predicates).reduce((prev, next) =>{
  //   return Object.assign(prev, {[next]: predicateBuilder(next)};)
  // }, {});

export const predicateMap = {
  '$ne': 'not',
  '$lt': '<',
  '$lte': '<=',
  '$gt': '>',
  '$gte': '>='
};

import BaseClause from './base-clause';
import Builder from '../builder';

// name: {$ne: 'Alice'} => $ne: [name: 'Alice'] ??
export default class Predicate extends BaseClause {
  constructor(name, predicate) {
    super(name);
    this.value = predicate.$ne;
    this.predicate = predicate;
    this.outputPredicate = this.predicateMap[predicate];
  }

  get predicateMap() {
    return predicateMap;
  }

  build() {
    return `[(${this.outputPredicate} ${this.clause})]`;
  }

  get clause() {
    return new Builder(this.name, this.value).build();
  }
}
