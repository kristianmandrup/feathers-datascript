import chai from 'chai';
// import baseTests from 'feathers-service-tests';
// import { errors } from 'feathers';
import Service from '../src';

let people;
let expect = chai.expect;
let _ids = {};
let options = {
  schema: {
    ':person/email': {
      // ':db/valueType': ':db.type/string',
      // ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':person/id': {
      // ':db/valueType': ':db.type/bigint',
      // ':db/cardinality': ':db.cardinality/one',
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
    people.create({
      ':person/email': 'douglas.adams@gmail.com',
      ':person/name': 'Doug',
      ':person/age': 42
    }, {}).then(data => {
      var id = data[':person/id'];
      _ids.Doug = id;
      done();
    }).catch(err => {
      console.error(err);
      throw 'People create error';
    });
  });

  afterEach(done => {
    people.remove(_ids.Doug, {})
    .then(() => {
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
