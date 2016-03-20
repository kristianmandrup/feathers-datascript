import { Eq, Or, Predicate } from './clauses';
import { predicateMap } from './clauses/predicate';

export default class Builder {
  constructor(name, predicate) {
    if (typeof name === 'object') {
      name = Object.keys(name)[0];
      predicate = Object.values(name)[0];
    }

    this.name = name;
    this.predicate = predicate; // or implicit value for EQ predicate
  }

  get clause() {
    id: Id,
    eq: Eq,
    or: Or,
    predicate: Predicate
  }

  build() {
    return new this.type(name, predicate);
  }

  get type() {
    if (typeof this.predicate !== 'object')
      return this.clause['eq'];

    if (this.predicate === '$id')
      return this.clause['id'];

    if (this.predicate === '$or')
      return this.clause['or'];

    if (predicateMap[this.predicate])
      return this.clause['predicate'];
    return null;
  }
}


