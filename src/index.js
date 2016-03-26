// import filter from 'feathers-query-filters';
import Query from './Query';
import { DataScriptAdapter } from './adapter';
// import { types as errors } from 'feathers-errors';
import _ from 'lodash';

function buildQuery(q) {
  return new Query(q).build();
}

function createAdapter(options) {
  console.log('createAdapter', options);
  return new DataScriptAdapter(options);
}

// Create the service.
// TODO: use ES6 class instead!
export default class PersonService {
  constructor(name, options = {}){
    if(!name){
      throw new SyntaxError('You must pass a String as the name of the entity');
    }

    var defaults = {
      schema: {}
    };
    options = _.merge(defaults, options);

    this.createAdapter = options.createAdapter || createAdapter;
    this.type = 'datascript';
    this.id = options.id || 'id';
    this.name = name;
    this.options = options;

    // TODO: To be used if DB is exposed as endpoint on a server
    // (ie. such as Express on Node.js)
    // var connectionOptions = {
    //   host: options.host,
    //   port: options.port
    // };

    // TODO: handle failed connections.
    this.adapter = this.adapter || this.createAdapter(options);
    console.log('Adapter created');
    return Promise.resolve(this.adapter);
  }

  get db() {
    return this.adapter.db;
  }

  get connection() {
    return this.adapter.connection;
  }

  _log(...args) {
    console.log('Service', ...args);
  }

  _q(query) {
    this._log('transact', query);
    return this.adapter.q(query, this.db);
  }

  _transact(connection, statement) {
    this._log('transact');
    return this.adapter.transact(this.connection, statement);
  }

  // retrieves a list of all resources from the service.
  // Provider parameters will be passed as params.query
  find(params) {
    if (!params.query) {
      throw 'params missing :query option';
    }
    var query = buildQuery(params.query);

    // Start with finding all, and limit when necessary.
    var result = this._q(query);
    return Promise.resolve(result);
  }

  // retrieves a single resource with the given id from the service.
  get(id, params) {
    params.$id = id;
    var query = new Query(params).build();

    // what do params do here?
    var result = this._q(query);
    return Promise.resolve(result);
  }

  // creates a new resource with data.
  // The method should return a Promise with the newly created data.
  // data may also be an array which creates and returns a list of resources.
  create(data) {
    console.log('create', data);
    const findMaxId = `[:find ?id :where [?e ":person/id" ?id]]`;

    const maxId = this._q(findMaxId);
    console.log('max person id', maxId);
    var nextId = maxId.length ? maxId + 1 : 0;
    var statement = _.merge({':db/add': -1, ':person/id': nextId}, data);
    this._log('create statement', statement);
    var result = this._transact(statement);
    console.log('created', result.db_after);
    return Promise.resolve({id: nextId});
  }

  // merges the existing data of the resource identified by id with the new data.
  // id can also be null indicating that multiple resources should be patched.
  // The method should return with the complete updated resource data.
  // Implement patch additionally to update if you want to separate
  // between partial and full updates and support the PATCH HTTP method.
  patch(id, data, params) {
    console.log('patch', id, data, params);
    var statement = _.merge({':db/id': id}, data);
    var result = this._transact(statement);
    return Promise.resolve(result.db_after);
  }

  // replaces the resource identified by id with data.
  // The method should return a Promise with the complete updated resource data.
  // id can also be null when updating multiple records.
  update(id, data, params) {
    console.log('update', id, data, params);
    // should retract, then add new entity
    const statements = {
      add: _.merge({':db/add': id}, data),
      remove: {':db.fn/retractEntity': id}
    };
    var result = this._transact([statements.remove, statements.add]);
    // Send response.
    return Promise.resolve(result.db_after);
  }

  // removes the resource with id. The method should return a Promise with
  // the removed resource. id can also be null indicating to delete
  // multiple resources.
  remove(id) {
    console.log('remove', id);
    if (!id) {
      throw 'remove requires id';
    }
    if (id) {
      var result = this._transact({':db/retractEntity': id});
      return Promise.resolve(result.db_after);
    }
  }

  setup(app) {
    this.app = app;
  }
}
