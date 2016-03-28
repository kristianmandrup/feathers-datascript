import { Id, Eq, Or, Predicate } from './clauses';
import { predicateMap } from './clauses/predicate';

export default class Builder {
  constructor(name, predicate) {
    // console.log('build', name, predicate);
    if (typeof name === 'object') {
      var key = Object.keys(name)[0];
      predicate = name[key];
      name = key;
    }

    if (typeof predicate !== 'object') {
      predicate = {'eq': predicate};
    }
    this.name = name;
    this.predicate = predicate;
    this.pred = this._extract(predicate);
    // console.log('pred', this.name, this.pred);
  }

  _extract(predicate) {
    var key = Object.keys(predicate)[0];
    this.value = predicate[key];
    return {
      key: key.replace('$', ''),
      value: this.value
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

  build(where) {
    this.setValue = where.setValue.bind(where);
    var clazz = this.type();
    var inst = clazz.create(this.name, this.predicate);
    this.setValue(this.value);
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
    predicate = {[key]: value};
  }
  return new Builder(name, predicate);
};
