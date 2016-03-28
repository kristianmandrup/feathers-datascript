import Query from './query';
import Pull from './pull';

export default class QueryBuilder {
  constructor(entityClass) {
    this.entityClass = entityClass;
  }

  byId(params) {
    return new Pull(this.entityClass, params).build();
  }

  query(params) {
    return new Query(this.entityClass, params).build();
  }
}