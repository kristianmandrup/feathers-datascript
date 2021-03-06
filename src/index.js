import Proto from 'uberproto';
import filter from 'feathers-query-filters';
import { datascript as d } from 'datascript';
import { types as errors } from 'feathers-errors';
import _ from 'lodash';

// Create the service.
export const Service = Proto.extend({
  init: function(name, options = {}){
    var self = this;

    if(!name){
      throw new SyntaxError('You must pass a String as the name of the entity')
    }

    var defaults = {
      schema: {}
    };
    options = _.merge(defaults, options);

    this.type = 'datascript';
    this.id = options.id || 'id';
    this.name = name;
    this.options = options;

    // TODO: To be used if DB is exposed as endpoint on a server 
    // (ie. such as Express on Node.js)
    var connectionOptions = {
      host: options.host,
      port: options.port
    };

    // TODO: handle failed connections.
    this.ready = new Promise(function(resolve){
        var db = d.empty_db(options.schema);
        resolve(db);
      });
    });
  },

  find: function(params, callback) {
    var self = this;

    self.ready.then(function(connection){
      var query = params.query;
      // Start with finding all, and limit when necessary.
      var result = d.q(query, connection);
      callback(result);
    });
  },

  get(id, params, callback) {
    var self = this;
    var args = arguments;

    self.ready.then(function(connection){
      var query = `[:find ?e
                    :in  $ ?e
                    :where [?e ':entity/name' ${self.name} ?n]

                    ]`

      // what do params do here?
      var result = d.q(query, connection)
      callback(result);
    });

  },

  // upsert
  create: function(data, params, callback) {
    var self = this;
    // use id: -1 to have Datascript generate ID
    this.ready.then(function(connection){
        var statement = _.merge({':db/add': -1}, data)
        d.transact(connection, statement);
        callback(null, data);
      });
    });
  },

  // upsert
  patch: function(id, data, params, callback) {
    this.update(id, data, params, callback);
  },

  // upsert
  update: function(id, data, params, callback) {
    var self = this;
    self.ready.then(function(connection){
        var statement = _.merge({':db/add': id}, data)
        d.transact(connection, statement);
        // Send response.
        callback(null, data);
      });
    });
  },

  remove: function(id, params, callback) {
    var self = this;
    self.ready.then(function(connection){
      d.transact(conn, {':db/retractEntity': id})
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
