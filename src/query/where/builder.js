import { Id, Eq, Or, Predicate } from './clauses';
import { predicateMap } from './clauses/predicate';

export default class Builder {
  constructor(name, predicate) {
    if (typeof predicate !== 'object') {
      predicate = {'eq': predicate};
    }
    this.name = name;
    this.predicate = predicate;
    this.pred = this._extract(predicate);
    console.log('pred', this.pred);
  }

  _extract(predicate) {
    var key = Object.keys(predicate)[0];
    var value = predicate[key];
    return {
      key: key.replace('$', ''),
      value: value
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
    var clazz = this.type();
    var inst = clazz.create(this.name, this.predicate);
    console.log('inst', inst);
    return inst.where;
  }

  type() {
    return this.clause[this.pred.key] || this.clause.predicate;
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
