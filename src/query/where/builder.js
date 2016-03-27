import { Id, Eq, Or, Predicate } from './clauses';
import { predicateMap } from './clauses/predicate';

export default class Builder {
  constructor(name, predicate) {
    this.predicate = {};

    // TODO: move to extract?
    if (typeof predicate !== 'object') {
      this.predicate.key = '$eq';
      this.predicate.value = predicate;
    }

    this.name = name;
    this.predicate = this.predicate || this._extract(predicate);

    console.log('Builder:', name, this.predicate);
  }

  _extract(predicate) {
    var key = Object.keys(predicate)[0];
    return {
      key: key,
      value: predicate[key]
    };
  }

  get clause() {
    return {
      id: Id,
      eq: Eq,
      or: Or,
      predicate: Predicate
    };
  }

  build() {
    return this.type().create(this.name, this.predicate);
  }

  type() {
    if (typeof this.predicate !== 'object') {
      return this.clause.eq;
    }
    if (this.predicate === '$id') {
      return this.clause.id;
    }
    if (this.predicate === '$or') {
      return this.clause.or;
    }
    if (predicateMap[this.predicate]) {
      return this.clause.predicate;
    }
    return null;
  }
}

Builder.create = (name, predicate) => {
  if (typeof name === 'object') {
    var attr = Object.keys(name)[0];
    var pred = name[attr];
    var key = Object.keys(pred)[0];
    var value = pred[key];

    return Builder.create(name, {[key]: value});
  }
};
