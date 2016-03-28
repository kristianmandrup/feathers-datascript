// "$select": ["name"] only name
// $select: ['id', 'name']

// NOTE: Use remove hook to exclude attributes after result
export default class Selector {
  constructor(params) {
    this.params = params;
  }

  get attrs() {
    if (this.params.$select) {
      return this.params.$select;
    }
    if (Array.isArray(this.params)) {
      return this.params.map(param => {
        return Object.keys(param)[0];
      });
    }
    if (typeof this.params === 'object') {
      return Object.keys(this.params);
    }
    return [];
  }

  get type() {
    return this.attrs.length > 0 ? 'only' : 'all';
  }
}
