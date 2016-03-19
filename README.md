# feathers-datascript
A [datascript](https://www.npmjs.com/package/datascript) and  [datomic](http://docs.datomic.com/architecture.html) service for FeathersJS.

## WIP: Under development
To help with development, you can run the tests with `npm run test`.

## Create DB

```js
import {datascript as d} from 'datascript'

var db = d.db_with(d.empty_db(schema), [data])
```
                         [

### UPSERT (Insert/Update in one)

When a transaction is processed, all the temporary ids are translated to actual entity ids. Temporary ids with the same partition and negative number value are mapped to the same entity id. Temporary ids are mapped to new entity ids unless you use a temporary id with an attribute defined as :db/unique :db.unique/identity, in which case the system will map your temporary id to an existing entity if one exists with the same attribute and value (update) or will make a new entity if one does not exist (insert). All further adds in the transaction that apply to that same temporary id are applied to the "upserted" entity.

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
var q = '[:find ?n ?a 
          :where [?e "name" ?n] 
                 [?e "age" ?a]
        ]';
```

You can pass query parameters via `:in`

```js
// pass parameter ?e using `in:`
q = '[:find ?aka 
      :in $ ?e 
      :where [?e "aka" ?aka]]'

assert_eq_set([["Ivan", 17]], d.q(q, db));

// passing multiple criteria arguments for `:in` - `?e` and `?email`
res     = d.q('[:find ?e ?email \
                  :in  $ [[?n ?email]] \
                  :where [?e "name" ?n]]',
                people_db,
```

Good luck and enjoy!
