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
      $select: {'password':-1} // all except password

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

// https://github.com/es-shims/Object.entries
// import entries from 'object.entries';

import Find from './find';
import In from './in'
import Where from './where';

export default class Query {
  constructor(params) {
    this.params = params;
  }

  get builders() {
    return {
      find: Find
      in: In
      where: Where
    };
  }

  build() {
    return [
      this.find(),
      this.in(),
      this.where()
    ];
  }

  clausesFor(type) {
    let clazz = this.builders[type];
    return new clazz(this.params).build()
  }

  find() {
    return {':find': this.clausesFor('find')};
  }

  in() {
    return {':in $': this.clausesFor('in')};
  }

  where() {
    return {':where': this.clausesFor('where')};
  }

  // perform limit/sort?
  run() {
  }
}



// http://www.2ality.com/2015/11/stage3-object-entries.html
// USE:
//    for (let [k, v] of entries(predicates))

function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}


  // for select/where, ideally we would use $in to pass values as arguments,
  // however this may be too complicated for now. 
  // Primitive string building of hard coded test values in :where 
  // looks (MUCH) easier for a first POC (prototype!)


  // $in, $nin: Contains (or not) given value in list
  //   {name: {$in: ['Alice', 'Bob']}}

  // Translations:
  // $or and $in are equivalent
  // $nin is simply an $or nested with a list of $ne inside (I think?)

  // Querying Collections: http://www.learndatalogtoday.org/chapter/3
  // :in $ [?director ...] 
  // :where [?p :person/name ?director]

  // $lt, $lte: less than <, <=
  //   {age: {$lte: 65 }}

  // $gt, $gte: less than >, >=
  //   {age: {$gte: 21 }}



  // More TODO...


  // TODO: return query we have built
  return query;
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
  return function predicateExpr(k, v) {
    return `[(${predicate} ?${k} ${v})]]`;
  }
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
  return `[?eid ?${attribute} ${value}]`;
}

function buildOr(obj) {
  return obj.map(not => {
    var clauses = [];
    for (let [k,v] of entries(obj)) {
      clauses.push(createOrClause(k, v));
    }
    return clauses;
  })
}

// '(or [['?eid', ':todo/name', "john"]
//     ['?eid', ':todo/age', 32]])'

function createOrClauses(obj) {
  let internalClauses = obj.map(not => {
    var clauses = [];
    for (let [k,v] of entries(obj)) {
      clauses.push(createWhereClause(k, v));
    }
    return clauses;
  })
  return `(or ${internalClauses})`
}


