import Proto from 'uberproto';
// import filter from 'feathers-query-filters';
import Query from './Query';
import { DataScriptAdapter } from './adapter';
// import { types as errors } from 'feathers-errors';
import _ from 'lodash';

function buildQuery(q) {
  return new Query(q).build();
}

function createAdapter(options) {
  console.log('createAdapter', options, DataScriptAdapter);
  return new DataScriptAdapter(options);
}

// Create the service.
// TODO: use ES6 class instead!
export const Service = Proto.extend({
  init: function(name, options = {}){
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
    this.ready = new Promise((resolve) => {
      console.log('Service Ready');
      this.adapter = this.createAdapter(options);
      console.log('Adapter created');
      resolve(this.adapter.connection);
    });
  },

  _log(...args) {
    console.log('Service', ...args);
  },

  q: function(query, connection) {
    this._log('transact', query, connection);
    return this.adapter.q(query, connection);
  },

  transact: function(connection, statement) {
    this._log('transact', connection, statement);
    return this.adapter.transact(connection, statement);
  },

  find: function(params, callback) {
    this.ready.then((connection) => {
      var query = buildQuery(params.query);

      // Start with finding all, and limit when necessary.
      var result = this.q(query, connection);
      callback(result);
    });
  },

  get(id, params, callback) {
    var self = this;

    self.ready.then((connection) => {
      params.$id = id;
      var query = new Query(params).build();

      // what do params do here?
      var result = this.q(query, connection);
      callback(result);
    });
  },

  // upsert
  create: function(data, params, callback) {
    // use id: -1 to have Datascript generate ID
    this.ready.then((connection) => {
      console.log('create', data);
      var statement = _.merge({':db/add': -1}, data);
      var result = this.transact(connection, statement);
      console.log('created', result);
      callback(null, data);
    });
  },

  // upsert
  patch: function(id, data, params, callback) {
    console.log('patch', id, data, params);
    this.update(id, data, params, callback);
  },

  // upsert
  update: function(id, data, params, callback) {
    console.log('update', id, data, params);
    this.ready.then((connection) => {
      var statement = _.merge({':db/add': id}, data);
      this.transact(connection, statement);
      // Send response.
      callback(null, data);
    });
  },

  remove: function(id, callback) {
    console.log('remove', id);
    if (!id) {
      throw 'remove requires id';
    }
    this.ready.then((conn) => {
      if (id) {
        this.transact(conn, {':db/retractEntity': id});
      } else {
        // if no id, remove all
        // http://docs.datomic.com/excision.html
        // Excision is the complete removal of a set of datoms matching a predicate.

        // or pull (find) all entity ids for this service
        // and delete them
        // let entities = this.pull(conn, '*');
        throw 'remove requires id';
      }

      callback();
    });
  },

  setup: function(app) {
    this.app = app;
    this.service = app.service.bind(app);
  }
});

export default function() {
  return Proto.create.apply(Service, arguments);
}



