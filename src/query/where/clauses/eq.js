import Base from './base';

export default class Eq extends Base {
  // name: 'Alice'
  constructor(name, value, where) {
    super(name);
    this.value = (typeof value === 'object') ? value.eq : value;
    this._where = where;
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
    return `?e ?${this.name} ${this._nameVal}`;
  }

  get _nameVal() {
    return `?${this.name}-value`;
  }

  get _val() {
    switch (typeof this.value) {
      case 'string':
        return `'${this.value}'`;
      default:
        // console.log('val', this.value);
        return `${this.value}`;
    }
  }
}

// allows calling with obj, where
Eq.create = (name, value, where) => {
  if (typeof name === 'object') {
    var key = Object.keys(name)[0];
    value = name[key];
    name = key;
    where = value;
  }
  return new Eq(name, value, where);
};
