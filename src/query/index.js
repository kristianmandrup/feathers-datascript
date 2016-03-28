import Find from './find';
import Where from './where';
import In from './in';
import _ from 'lodash';

export default class Query {
  // 'name', 'age'
  // {name: 'alice'}
  // in - {name: {$in: ['alice', 'wonder']}}
  // not in - {name: {$nin: ['alice', 'wonder']}}
  constructor(entityClass, q, options) {
    this.options = options || {};
    this.entityClass = entityClass;
    this.q = q;
    this._where = new Where(this.q, this.queryOptions);
  }

  // inline attribute names per default!?
  get queryOptions() {
    return {
      mode: this.options.mode, // || 'inline',
      entityName: this.entityClass
    };
  }

  build() {
    var res = {
      query: {
        ':find': this.find,
        ':in': this.ins,
        ':where': this.where
      },
      params: {
        values: this._where.values,
        names: this._where.names
      }
    };
    res.params.getNames = (mapFn) => {
      mapFn = mapFn || this.options.mapNames;
      return mapFn ? res.params.names.map(mapFn) : res.params.names;
    };
    res.params.all = _.zip(res.params.getNames(), res.params.values);
    return res;
  }

  get find() {
    return new Find(this.q).build();
  }

  get ins() {
    return new In(this.q).build();
  }

  get where() {
    return this._where.build();
  }
}