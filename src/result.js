export default class Result {
  constructor(result) {
    this.result = result;
    this.params = result.params;
  }

  build() {
    let result = this._filterResult();
    return this._enrichResult(result, this.params.names);
  }

  // q returns simple data array: We should convert into JSON
  // with every value keyed by attribute
  // [['kris' 32]] => [{name: 'kris', age: 32}
  enrichResult(result, attributes) {
    return result.map(item => {
      return item.map((value, index) => {
        var key = attributes[index];
        return {[key]: value};
      });
    });
  }

  // http://docs.feathersjs.com/databases/pagination.html
  //  $limit: number
  //  $skip: number
  //  $sort: { name: 1 }
  filterResult() {
    var {$limit, $skip, $sort} = this.params;
    var slicedRes = this.result.slice($skip || 0);
    var pagedRes = this.slicedRes.slice($limit || 0);
    return this._sort(pagedRes, $sort);
  }

  sort() {
    var key = Object.keys(this.params)[0];
    var direction = this.params[key];
    return this.result.sort((a, b) => {
      return direction === 1 ? a[key] > b[key] : a[key] < b[key];
    });
  }
}