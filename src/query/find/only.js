export default class Only {
  constructor(attrs) {
    this.attrs = attrs;
  }

  // return tuples of attribute/value
  build() {
    return {
      ':find': this._find,
      ':in': this._in,
      ':where': this._where
    };
  }

  get _find() {
    return this.attrs.map(name => {
      return `?${name}-value`;
    });
  }

  get _in() {
    return this.attrs.map(name => `?${name}`);
  }

  get _where() {
    return this.attrs.map(name => `?e ?${name} ?${name}-value`);
  }
}