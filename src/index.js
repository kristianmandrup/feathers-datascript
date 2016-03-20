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

  /*
    Pagination:
      $limit: max # or records to return 
        {$limit: 10}
      $skip: how many records to skip before starting query 
        {$skip: 100}

    Sorting:
      $sort: {name: 1} // name:ascending
      $sort: {age: -1} // age:descending

    Select:
      $select: {'name':1} // only name
      $select: {'password':0} // all except password

    Where
      ==
      {name: 'Alice'} // all where name == 'Alice'

      $in, $nin: Contains (or not) given value in list
        {name: {$in: ['Alice', 'Bob']}}
      $lt, $lte: less than <, <=
        {age: {$lte: 65 }}

      $gt, $gte: less than >, >=
        {age: {$gte: 21 }}

      $ne: Not equal: {age: {$ne: 25 }}
      $or: or (either)
        {$or: [{name: 'Alice'}, {name: 'Bob'}]}
  */
  find: function(params, callback) {
    var self = this;

    self.ready.then(function(connection){
      var query = buildQuery(params.query);

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

import filter from 'filter-object';

// http://www.2ality.com/2015/11/stage3-object-entries.html
function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}


function buildQuery(params) {
  let query = [];
  let wheres = {};
  let clauses = {};

  // WIP: this is mainly a sketch of idea/algorithm
  // UNTESTED... Needs more love/work!

  params.$equals = filter(params, '!$*')

  let selectSet = {
    invalid: filterSelect(params.$select, -1),
    valid: filterSelect(params.$select, 1),
  };
  var selects = Object.keys(params.$equals);

  // for select/where, ideally we would use $in to pass values as arguments,
  // however this may be too complicated for now. 
  // Primitive string building of hard coded test values in :where 
  // looks (MUCH) easier for a first POC (prototype!)

  wheres.eq = buildWhereEqs(params.$equals);

  // $ne: Not equal: {age: {$ne: 25 }}
  where.not = buildNots(params.$ne)

  // $in, $nin: Contains (or not) given value in list
  //   {name: {$in: ['Alice', 'Bob']}}

  // Translations:
  // $or and $in are equivalent
  // $nin is simply an $or nested with a list of $ne inside (I think?)

  // $lt, $lte: less than <, <=
  //   {age: {$lte: 65 }}

  // $gt, $gte: less than >, >=
  //   {age: {$gte: 21 }}


  let predicates = {
    '<': '$lt',
    '<=': '$lte',
    '>': '$gt',
    '>=': '$gte'
  };
  let predKeys = Object.keys(predicates);
  let predicateFuns = Object.keys(predicates).reduce((prev, next) =>{
    return Object.assign(prev, {[next]: predicateBuilder(next)};)
  }, {});

  let wherePreds = predicateExprs(predicates, predicateFuns);

  Object.assign(where, wherePreds);

  // collect all the where object values into one list of where clauses
  let clauses.where = [].concat(Object.values(where));

  // More TODO...

  // TODO: return query we have built
  return params;
}

function predicateExprs(predicates, predicateFuns) {
  var whereClauses = [];
  for (let [k, v] of entries(predicates)) {
    let predFun = predicateFuns[k];
    whereClauses.push(predFun(k, v));
  }
  return whereClauses;
}

function predicateBuilder(predicate) {
  return function predicateExpr(attribute, value) {
    return `[(${predicate} ?${attribute} ${value})]]`;
  }
}

function filterSelect(obj, criteria) {
  return Object.keys(filter(obj, criteria));
}

// TODO: use a class for each type of clause!?

function buildWhereEqs(list) {
  var whereClauses = [];
  for (let [k,v] of entries(obj)) {
    whereClauses.push(createWhereClause(k, v));
  }
  return whereClauses;
}

function createWhereClause(k, v) {
  return `[?eid ${attribute} ${value}]`;
}

function buildNots(obj) {
  obj.map(not => {
    var clauses = [];
    for (let [k,v] of entries(obj)) {
      clauses.push(createNotClause(k, v));
    }
    return clauses;
  })
}

function createNotClause(attribute, value) {
  return `(not [?eid ${attribute} ${value}])`
}
