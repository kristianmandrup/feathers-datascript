function buildSelector($select) {
  return (criteria) => {
    return Object.keys(filter($select, criteria));
  }
}

export default class Selector {
  constructor(params) {
    this.params = params;
  }

  get set() {
    return {
      all: this.select((val) => val === '*')),
      only: this.select(1)),

      // NOT supported yet
      except: this.select(-1)
    };
  }

  get select() {
    return buildSelector(this.params.$select);
  }

  has(type) {
    return this.set[type].length > 0;
  }

  get type() {
    for (key of Object.keys(this.set))
      if (this.has(key)) return key;
    return 'all';
  }
}
