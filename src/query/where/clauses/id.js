import Base from './base';

// match entity Id
export default class Id extends Base {
  // $id: 27
  // perhaps we could call as: 'People', 27, ie. with class as well?
  constructor(entityClass, id) {
    super();
    this.id = id;
    this.entityClass = entityClass;
  }

  // could we match on entity type also?
  // [?eid :entity/type ${this.name}]
  build() {
    return {
      ':find': this._find,
      ':in': this._in,
      ':where': this._where
    };
  }

  get _find() {
    return ['?id'];
  }

  get _in() {
    return ['?id'];
  }

  get _where() {
    return `[?eid ${this._entityIdAttr()} ?id]`;
  }

  _entityIdAttr() {
    return `:${this.entityClass}/id`;
  }
}

Id.create = (entityClass, id) => {
  return new Id(entityClass, id);
};