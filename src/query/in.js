import { toTupleObjList } from '../util';

export default class In {
  // 'name', 'age'
  // {name: 'alice'}
  // in - {name: {$in: ['alice', 'wonder']}}
  // not in - {name: {$nin: ['alice', 'wonder']}}

  // TODO: exclude attribute names if mode: inline
  constructor(params) {
    if (typeof params === 'object') {
      params = toTupleObjList(params);
    }
    // console.log('params', params);
    this.params = params;
  }

  build() {
    if (!this.params || this.params.length === 0) {
      return {};
    }
    return `${this.clause}`;
  }

  get clause() {
    return this.params.map(param => {
      return this._value(param);
    }).join(' ');
  }

  _value(param) {
    return (typeof param === 'object') ? this._objValue(param) : `?${this._format(param)}`;
  }

  _format(name) {
    return `${name}-value`;
  }

  // ie. {name: {$in: ['alice', 'wonder']}}
  _objValue(param) {
    var key = Object.keys(param)[0];
    var value = param[key];
    // get value
    if (value.$in || value.$nin) {
      return `[?${this._format(key)} ...]`;
    }
    return `?${this._format(key)}`;
  }
}