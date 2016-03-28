export default class Base {
  constructor(name) {
    this.name = name;
  }

  get attributeName() {
    return this.mode === 'inline' ? `:${this.entityName}/${this.name}` : `?${this.name}`;
  }

  get entityName() {
    return this.options.entityName;
  }

  build() {
    throw 'build must be implemented by subclass';
  }
}


