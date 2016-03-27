export default class Only {
  constructor(attrs) {
    this.attrs = attrs;
  }

  // return tuples of attribute/value
  build() {
    return {
      find: this._findAttrs(),
      where: this._whereClauses()
    };
  }

  _whereClauses() {
    return this.attrs.map(name => `?e ?${name} ?${name}-value`);
  }

  _findAttrs() {
    return this.attrs.map(name => `?${name} ?${name}-value`);
  }
}