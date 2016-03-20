import BaseClause from './base-clause';

export default class Eq extends BaseClause {
  // name: 'Alice'
  constructor(name, value) {
    super(name);
    this.value = value;
  }

  build() {
    return `[?eid ?${name} ${value}]`;
  }
}
