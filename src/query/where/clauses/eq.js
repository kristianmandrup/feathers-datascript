import Base from './base';

export default class Eq extends Base {
  // name: 'Alice'
  constructor(name, value, where) {
    super(name);
    this.value = value;
    if (typeof value === 'object') {
      this.value = value.eq;
    }
    this._where = where;
  }

  get mode() {
    return this.options ? this.options.mode : null;
  }

  build() {
    return {
      ':where': this.where
    };
  }

  get where() {
    return `[${this.clause}]`;
  }

  get clause() {
    return `?e ${this.attributeName} ${this._nameVal}`;
  }

  get _nameVal() {
    return `?${this.name}-value`;
  }

  get _val() {
    switch (typeof this.value) {
      case 'string':
        return `'${this.value}'`;
      default:
        return `${this.value}`;
    }
  }
}

// allows calling with obj, where
Eq.create = (name, value, where) => {
  if (typeof name === 'object') {
    var key = Object.keys(name)[0];
    where = value;
    value = name[key];
    name = key;
  }
  return new Eq(name, value, where);
};
