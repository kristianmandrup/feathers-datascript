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

import Base from './base';
import Eq from './eq';
import Builder from '../builder';

// name: {$ne: 'Alice'} => $ne: [name: 'Alice'] ??
export default class Predicate extends Base {
  constructor(name, predicate) {
    super(name);
    var key = Object.keys(predicate)[0];
    this.key = key;
    this.value = predicate[key];
    this.predicate = predicate;
    this.outputPredicate = this.predicateMap[key];
  }

  get predicateMap() {
    return predicateMap;
  }

  build() {
    return {
      ':where': this.where
    };
  }

  get where() {
    if (this.key === '$eq') {
      return this.clause;
    }
    return `[(${this.outputPredicate} ${this.clause})]`;
  }

  get clause() {
    if (typeof this.value === 'object') {
      var builder = Builder.create(this.name, this.value);
      return builder.where;
    }
    var eq = new Eq(this.name, this.value);
    return eq.clause;
  }
}

Predicate.create = (name, predicate) => {
  return new Predicate(name, predicate);
};