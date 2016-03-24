export default [{
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
},
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
}];