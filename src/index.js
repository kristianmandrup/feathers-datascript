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
      this.adapter = this.createAdapter(options);
      resolve(this.adapter);
    });
  },

  q: function(query, connection) {
    return this.adapter.q(query, connection);
  },

  transact: function(connection, statement) {
    return this.adapter.transact(connection, statement);
  },

  find: function(params, callback) {
    var self = this;

    self.ready.then((connection) => {
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
      var statement = _.merge({':db/add': -1}, data);
      this.transact(connection, statement);
      callback(null, data);
    });
  },

  // upsert
  patch: function(id, data, params, callback) {
    this.update(id, data, params, callback);
  },

  // upsert
  update: function(id, data, params, callback) {
    var self = this;
    self.ready.then((connection) => {
      var statement = _.merge({':db/add': id}, data);
      this.transact(connection, statement);
      // Send response.
      callback(null, data);
    });
  },

  remove: function(id, callback) {
    var self = this;
    self.ready.then((conn) => {
      this.transact(conn, {':db/retractEntity': id});
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



