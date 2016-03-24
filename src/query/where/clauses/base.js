export default class BaseClause {
  constructor(name) {
    this.name = name;
  }

  build() {
    throw 'build must be implemented by subclass';
  }
}


