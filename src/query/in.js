export default class In {
  // 'name', 'age'
  // {name: 'alice'}
  // in - {name: {$in: ['alice', 'wonder']}}
  // not in - {name: {$nin: ['alice', 'wonder']}}
  constructor(params) {
    this.params = params;
  }

  build() {
    if (!this.params || this.params.length === 0) {
      return {};
    }
    return {
      ':in': `${this._params}`
    };
  }

  get _params() {
    return this.params.map(param => {
      return this._value(param);
    }).join(' ');
  }

  _value(param) {
    return (typeof param === 'object') ? this._objValue(param) : `?${param}`;
  }

  // ie. {name: {$in: ['alice', 'wonder']}}
  _objValue(param) {
    var key = Object.keys(param)[0];
    var value = param[key];
    // get value
    if (value.$in || value.$nin) {
      return `[?${key} ...]`;
    }
    return '';
  }
}