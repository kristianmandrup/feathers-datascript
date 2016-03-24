# feathers-datascript
A [datascript](https://www.npmjs.com/package/datascript) and [datomic](http://docs.datomic.com/architecture.html) service for FeathersJS.

[Datomic: The most innovative DB you've never heard of](http://augustl.com/blog/2016/datomic_the_most_innovative_db_youve_never_heard_of/)

See [datascript-tutorial](https://github.com/kristianmandrup/datascript-tutorial)

## Datomic JS driver

Also use Datomic from JS via [datomicjs](https://github.com/kristianmandrup/datomicjs) module.

## CRUD blog posts
- [datascript/clojure](http://thegeez.net/2014/04/30/datascript_clojure_web_app.html)
- [datascript/quiescent](http://thegeez.net/2014/05/01/datascript_quiescent_standalone.html)
- [clj-crud app](https://github.com/thegeez/clj-crud)

## Install/use

Fork [datomicjs](https://github.com/kristianmandrup/datomicjs) and from your local repo, use `npm link` so that feathersjs-datascript references your local copy (for development).

Then install modules

`$ npm install`

## Contribute/Run test

`$ npm test`

## WIP: Under development
To help with development, you can run the tests with `npm run test`.

The *tricky part* is to build a full [Datalog query](http://docs.datomic.com/query.html) from the standard FeathersJS query syntax. This is all (attempted to be) achieved in the `/query` folder. Work will continue there... :)

Datascript/Datomic Schema example:

```js
  [{
    // primary key: :person/id, int, unique, indexed
    'db/id': ':person/external-id',
    ':db/ident': ':person/id',
    ':db/valueType': ':db.type/bigint',
    ':db/unique': ':db.unique/identity',
    ':db/index': true
  },
  // firstname, string[1]
  {
    ':db/ident': ':person/firstName',
    ':db/cardinality': ':db.cardinality/one',
    ':db/valueType': ':db.type/string'
  }
  // lastName, string[1]  
  {
    ':db/ident': ':person/lastName',
    ':db/cardinality': ':db.cardinality/one',
    ':db/valueType': ':db.type/string'
  },
  {
    ':db/add': -1,
    ':person/id': 123,
    ':person/firstName': 'John',
    ':person/lastName': 'Doe'
  }]

```

## Create DB

```js
import {datascript as d} from 'datascript'

var db = d.empty_db(db, options.schema)

// or with schema AND initial data
var db = d.empty_db(db, schema, [data])
```
                         [

### UPSERT (Insert/Update in one)

When a transaction is processed, all the temporary ids are translated to actual entity ids. Temporary ids with the same partition and negative number value are mapped to the same entity id. Temporary ids are mapped to new entity ids unless you use a temporary id with an attribute defined as `:db/unique` `:db.unique/identity`, in which case the system will map your temporary id to an existing entity if one exists with the same attribute and value (update) or will make a new entity if one does not exist (insert). All further adds in the transaction that apply to that same temporary id are applied to the "upserted" entity.

Please see [Datomic Tutorial](http://docs.datomic.com/tutorial.html)
Section *Adding, updating, and retracting data*

### ADD entity (generated ID)

To add nested object, use attribute refs, ie. `:todo/project` below

from: [add-todo](https://github.com/tonsky/datascript-todo/blob/gh-pages/src/datascript_todo/core.cljs#L223)

```js
let project = {':db/add': -1, ':project/name': 'my project'}

let todo = {':db/id': -2,
            ':todo/text:': 'clean kitchen',
            ':todo/done': false,
            ':todo/project': -1,
            ':todo/due': new Date(),
            ':todo/tags': ['house', 'chore']}

d.transact(conn, [project, todo]);
```

### DELETE entity (by ID)

```js
d.transact(conn, {':db/retractEntity': -1});
```

### UPDATE entity (by ID)

See Add, since attributes/entities (same) are simply updated if already exists.

### FIND by criteria

Datascript and Datomic both use [datalog](http://www.learndatalogtoday.org/) for queries.

In the example below, `?e` is the entity ID and `?n` and `?a` are attribute values that must match

```js
var q = `[:find ?n ?a
          :where [?e "name" ?n]
                 [?e "age" ?a]
        ]`;
```

You can pass query parameters via `:in`

```js
// pass parameter ?e using `in:`
q = `[:find ?aka
      :in $ ?e
      :where [?e "aka" ?aka]]`

assert_eq_set([["Ivan", 17]], d.q(q, db));

// passing multiple criteria arguments for `:in` - `?e` and `?email`
res     = d.q(`[:find ?e ?email
                  :in  $ [[?n ?email]]
                  :where [?e "name" ?n]]`,
                people_db,
```

Good luck and enjoy!
