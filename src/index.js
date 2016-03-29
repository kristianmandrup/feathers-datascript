// import filter from 'feathers-query-filters';
import QueryBuilder from './query_builder';
import { DataScriptAdapter } from './adapter';
// import { types as errors } from 'feathers-errors';
import _ from 'lodash';

function createAdapter(options) {
  return new DataScriptAdapter(options);
}

// Create the service.
export default class PersonService {
  // {log: true} to enable logging
  constructor(name, options = {}){
    if(!name){
      throw new SyntaxError('You must pass a String as the name of the entity');
    }

    var defaults = {
      schema: {}
    };
    options = _.merge(defaults, options);

    this.createAdapter = options.createAdapter || createAdapter;
    this.id = options.id || 'id';
    this.name = name;
    this.options = options;

    // TODO: handle failed connections.
    this.adapter = this.adapter || this.createAdapter(options);
    this.type = this.adapter.name;
    this.queryBuilder = new QueryBuilder(this.entityClass);
  }

  get findMaxId() {
    return `[:find ?id :where [?e ":${this.entityName}/id" ?id]]`;
  }

  get entityClass() {
    return this.constructor.name.replace(/Service$/, '');
  }

  get entityName() {
    return this.entityClass.toLowerCase();
  }

  get db() {
    return this.adapter.db;
  }

  get connection() {
    return this.adapter.connection;
  }

  _log(...args) {
    if (this.options.log) {
      console.log('Service', ...args);
    }
  }

  _q(query, qParams) {
    this._log('transact', query, qParams);
    return this.adapter.q(query, this.db);
  }

  _transact(statement) {
    this._log('transact');
    return this.adapter.transact(statement);
  }

  _resultFor(thenable) {
    return Promise.resolve(thenable);
  }

  // retrieves a list of all resources from the service.
  // Provider parameters will be passed as params.query
  find(params) {
    if (!params.query) {
      throw 'params missing :query option';
    }
    // default options: inline attribute names
    // TODO: fix in to include/exclude attribute names dep. on mode
    var res = this.queryBuilder.query(params.query, {});

    // pass attribute names, and values as params to query
    var qParams = res.params.values;

    return this._q(res.query, qParams).then(result => {
      return this._resultFor(result);
    });
  }

  // retrieves a single resource with the given id from the service.
  get(id, params) {
    params.$id = id;
    var query = this.queryBuilder.byId(this.entityName, {id: id});

    // what do params do here?
    return this._q(query).then(result => {
      return this._resultFor(result);
    });
  }

  get id() {
    return `:${this.entityName}/id`;
  }

  addEntity(data) {
    return _.merge({':db/add': -1}, data);
  }

  updateEntity(id, data) {
    return _.merge({':db/add': id}, data);
  }

  removeEntity(id) {
    return {':db.fn/retractEntity': id};
  }

  // creates a new resource with data.
  // The method should return a Promise with the newly created data.
  // data may also be an array which creates and returns a list of resources.
  create(data) {
    this._q(this.findMaxId).then(queryRes => {
      var nextId = queryRes.length ? queryRes[0] + 1 : 0;
      var transactData = _.merge({[this.id]: nextId}, data);
      var statement = this.addEntity(transactData);
      // this._log('create statement', statement);
      return this._transact(statement).then(result => {
        return this._resultFor(transactData);
      });
    });
  }

  // merges the existing data of the resource identified by id with the new data.
  // id can also be null indicating that multiple resources should be patched.
  // The method should return with the complete updated resource data.
  // Implement patch additionally to update if you want to separate
  // between partial and full updates and support the PATCH HTTP method.
  patch(id, data, params) {
    var statement = this.updateEntity(id, data);
    return this._transact(statement).then(result => {
      return this._resultFor(result.db_after);
    });
  }

  // replaces the resource identified by id with data.
  // The method should return a Promise with the complete updated resource data.
  // id can also be null when updating multiple records.
  update(id, data, params) {
    // console.log('update', id, data, params);
    // should retract, then add new entity
    const statements = {
      add: this.updateEntity(id, data),
      remove: this.removeEntity(id)
    };
    var transactions = [statements.remove, statements.add];
    return this._transact(transactions).then(result => {
      return this._resultFor(result.db_after);
    });
  }

  // removes the resource with id. The method should return a Promise with
  // the removed resource. id can also be null indicating to delete
  // multiple resources.
  remove(id) {
    if (isNaN(id)) {
      throw 'remove requires a numeric id';
    }
    var statement = this.removeEntity(id);
    return this._transact(statement).then(result => {
      return this._resultFor(result.db_after);
    });
  }

  setup(app) {
    this.app = app;
  }
}
