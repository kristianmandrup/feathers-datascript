import Base from './base';

// match entity Id
export default class Id extends Base {
  // $id: 27
  // perhaps we could call as: 'People', 27, ie. with class as well?
  constructor(id) {
    super();
    this.id = id;
  }

  // could we match on entity type also?
  // [?eid :entity/type ${this.name}]
  build() {
    return `[?eid ?${this.id}]`;
  }
}
