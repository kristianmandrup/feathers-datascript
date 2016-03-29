import { Id, NotEq, Eq, Or, Predicate } from './clauses';
import { predicateMap } from './clauses/predicate';

export default class Builder {
  constructor(name, predicate) {
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
  }

  _extract(predicate) {
    if (Array.isArray(predicate)) {
      return {
        key: 'or',
        value: predicate
      };
    }
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
      'in': Eq,
      nin: NotEq,
      or: Or,
      predicate: Predicate
    };
  }

  // TODO: fix clazz.create, should always pass (object, where)
  build(where) {
    if (where) {
      this.setValue = where.setValue.bind(where);
      this.setName = where.setName.bind(where);
      this.setValue(this.value);
      this.setName(this.name);
    }
    var clazz = this.type;
    var obj = {[this.name]: this.predicate};
    var inst = clazz.create(obj, where);
    inst.options = this.options;

    return inst.where;
  }

  get type() {
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
