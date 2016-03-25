export default class Base {
  constructor(name) {
    this.name = name;
  }

  build() {
    throw 'build must be implemented by subclass';
  }
}


