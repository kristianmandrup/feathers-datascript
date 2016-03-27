// "$select": ["name"] only name
// $select: ['id', 'name']

// NOTE: Use remove hook to exclude attributes after result
export default class Selector {
  constructor(params) {
    this.params = params;
  }

  get attrs() {
    return this.params.$select || [];
  }

  get type() {
    return this.attrs.length > 0 ? 'only' : 'all';
  }
}
