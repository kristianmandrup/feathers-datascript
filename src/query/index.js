import Find from './find';
import Where from './where';
import In from './in';

export default class Query {
  // 'name', 'age'
  // {name: 'alice'}
  // in - {name: {$in: ['alice', 'wonder']}}
  // not in - {name: {$nin: ['alice', 'wonder']}}
  constructor(q) {
    this.q = q;
  }

  build() {
    return {
      // ':find': this.find,
      // ':in': this.ins,
      ':where': this.where
    };
  }

  get find() {
    return new Find(this.q).build();
  }

  get ins() {
    return new In(this.q).build();
  }

  get where() {
    return new Where(this.q).build();
  }
}