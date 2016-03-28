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
  constructor(name, predicate, where) {
    super(name);
    var key = Object.keys(predicate)[0];
    this.key = key;
    this._where = where;
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
      builder.options = this.options;
      return builder.where;
    }
    var eq = new Eq(this.name, this.value, this._where);
    eq.options = this.options;
    return eq.clause;
  }
}

Predicate.create = (name, predicate, where) => {
  var pred;
  if (typeof name === 'object') {
    var key = Object.keys(name)[0];
    where = predicate;
    pred = name[key];
    name = key;
  }
  return new Predicate(name, pred || predicate, where);
};