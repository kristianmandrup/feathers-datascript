import Find from './find';
import Where from './where';
import In from './in';

export default class Query {
  // 'name', 'age'
  // {name: 'alice'}
  // in - {name: {$in: ['alice', 'wonder']}}
  // not in - {name: {$nin: ['alice', 'wonder']}}
  constructor(entityClass, q) {
    this.entityClass = entityClass;
    this.q = q;
    this._where = new Where(this.q);
  }

  build() {
    return {
      query: {
        ':find': this.find,
        ':in': this.ins,
        ':where': this.where
      },
      params: this.paramValues
    };
  }

  get paramValues() {
    return this._where.values;
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