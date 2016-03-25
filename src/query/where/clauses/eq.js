import Base from './base';

export default class Eq extends Base {
  // name: 'Alice'
  constructor(name, value) {
    super(name);
    this.value = value;
  }

  build() {
    return `[?eid ?${this.name} ${this.value}]`;
  }
}
