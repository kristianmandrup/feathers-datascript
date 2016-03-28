import Base from './base';

export default class Eq extends Base {
  // name: 'Alice'
  constructor(name, value) {
    super(name);
    this.value = value;
  }

  build() {
    return {
      ':where': this.where
    };
  }

  get where() {
    return `[?eid ?${this.name} ${this._val}]`;
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

Eq.create = (name, value) => {
  return new Eq(name, value);
};
