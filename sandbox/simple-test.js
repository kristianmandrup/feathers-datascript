var d = require('datascript');
var _ = require('underscore');

var res = {
  passed: 0,
  failures: 0,
  asserts: 0,
  errors: 0
};

var people_db = d.db_with(d.empty_db({'age': {':db/index': true}}),
                 [{ ':db/id': 1, 'name': 'Ivan', 'age': 15 },
                  { ':db/id': 2, 'name': 'Petr', 'age': 37 },
                  { ':db/id': 3, 'name': 'Ivan', 'age': 37 }]);

var res = d.q(`[:find [?name ...] \
                :where [_ 'name' ?name]]`,
              people_db);
assert_eq(['Ivan', 'Petr'], res);

function assert_eq(expected, got, message) {
  res.asserts++;
  if (!_.isEqual(expected, got)) {
    res.errors--;
    res.failures++;
    throw (message || 'Assertion failed') + ': expected: ' + JSON.stringify(expected) + ', got: ' + JSON.stringify(got);
  }
}
