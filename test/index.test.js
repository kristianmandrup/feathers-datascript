import chai from 'chai';
// import baseTests from 'feathers-service-tests';
// import { errors } from 'feathers';
import Service from '../src';
// import { datascript as d } from 'datascript';
// import { Datomic } from 'datomic';

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
let people;

function createPeople() {
  return new Service('people', options);
}

function clean(done) {
  createPeople().then((service) =>{
    people = service;
    console.log('people Service ready', service);
    done();
  });
}

describe('feathers-datascript', () => {

  before(clean);
  after(clean);

  beforeEach(done => {
    console.log('creating people');
    people.create({
      ':person/email': 'douglas.adams@gmail.com',
      ':person/name': 'Doug',
      ':person/age': 42
    }, {}).then((error, data) => {
      console.log('People created', data);
      if (error) {
        console.error(error);
        throw 'people create error';
      }
      console.log('person Doug created, id:', data.id);
      _ids.Doug = data.id;
      done();
    });
  });

  afterEach(done => {
    console.log('after: remove doug ', _ids.Doug);
    people.remove(_ids.Doug, {})
    .then((error) => {
      console.log('people removed?');
      if (error) {
        console.error(error);
        throw 'people create error';
      }
      done();
    });
  });

  it('basic functionality', done => {
    console.log(expect);
    expect(typeof 1).to.equal('number');
    done();
  });
  // baseTests(people, _ids, errors.types);
});
