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

// Pull is a declarative way to make hierarchical
// (and possibly nested) selections of information about entities.
// Pull applies a pattern to a collection of entities,
// building a map for each entity

// Pull is likely a better way to make simple queries for Domain entities

// The pull API takes three arguments

// - a database
// - a pattern
// - an entity identifier
// db.pull("[*]", ledZeppelin);

// The [entity identifier](http://docs.datomic.com/identity.html#entity-identifiers)
// can be one of:
// - Entity id
// - Idents
// - Lookup Refs

// Unique identity is specified through an attribute with
// `:db/unique` set to `:db.unique/identity`

// Idents should not be used as unique names or ids on ordinary domain entities.
// Such entity names should be implemented with a domain-specific
// attribute that is a unique identity.

// [:todo/id 123]

// Fetch all Todos:  db.pull("[*]", [:todo/id 123]);

export default class Pull {
  constructor(params) {
    this.params = params;
  }

  // SELECT firstName, lastName From Person
  // db.pull([:person/firstName :person/lastName])

  // SELECT firstName, lastName FROM Person WHERE Person.id = 123
  // db.pull([:person/firstName :person/lastName], [:person/id 123])

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
}