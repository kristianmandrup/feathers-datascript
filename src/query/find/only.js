export default class Only {
  constructor(attrs) {
    this.attrs = attrs;
  }

  // return tuples of attribute/value
  build() {
    return {
      find: this._findAttrs(),
      ins: this._ins(),
      where: this._whereClauses()
    };
  }

  _findAttrs() {
    return this.attrs.map(name => `?${name}-value`);
  }

  _ins() {
    return this.attrs.map(name => `?${name}`);
  }

  _whereClauses() {
    return this.attrs.map(name => `?e ?${name} ?${name}-value`);
  }
}