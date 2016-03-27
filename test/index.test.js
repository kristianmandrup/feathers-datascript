import chai from 'chai';
// import baseTests from 'feathers-service-tests';
// import { errors } from 'feathers';
import Service from '../src';
// import { datascript as d } from 'datascript';
// import { Datomic } from 'datomic';

let people;
let expect = chai.expect;
let _ids = {};
let options = {
  schema: {
    ':person/email': {
      ':db/valueType': ':db.type/string',
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':person/id': {
      ':db/valueType': ':db.type/bigint',
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    }
  }
};

function createPeople() {
  return new Service('people', options);
}

function clean(done) {
  people = createPeople();
  done();
}

describe('feathers-datascript', () => {

  before(clean);
  after(clean);

  beforeEach(done => {
    console.log('creating people:', people);
    people.create({
      ':person/email': 'douglas.adams@gmail.com',
      ':person/name': 'Doug',
      ':person/age': 42
    }, {}).then(data => {
      // if (error) {
      //   console.error(error);
      //   throw 'people create error';
      // }
      var id = data[':person/id'];

      console.log('People created with data:', data);
      console.log('person Doug created, id:', id);
      _ids.Doug = id;
      done();
    }).catch(err => {
      console.error(err);
      throw 'People create error';
    });
  });

  afterEach(done => {
    console.log('after: remove doug ', _ids.Doug);
    people.remove(_ids.Doug, {})
    .then((data) => {
      console.log('people removed', data);
      done();
    }).catch(err => {
      console.error(err);
      throw 'People remove error';
    });
  });

  it('basic functionality', done => {
    console.log(expect);
    expect(typeof 1).to.equal('number');
    done();
  });
  // baseTests(people, _ids, errors.types);
});
