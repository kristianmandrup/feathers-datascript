import chai from 'chai';
import baseTests from 'feathers-service-tests';
import { errors } from 'feathers';
import service from '../src';
// import { datascript as d } from 'datascript';
// import { Datomic } from 'datomic';

let expect = chai.expect;
let _ids = {};
let options = {};
let people = service('people', options);

function clean(done) {
  people.ready.then(() => {
      console.log('people Service ready');
      done();
  });
}

describe('feathers-datascript', () => {

  before(clean);
  after(clean);

  beforeEach(done => {
    console.log('creating people');
    people.create({
      name: 'Doug',
      age: 32
    }, {}, (error, data) => {
      console.log('people created?');
      if (error) {
        console.error(error);
        throw 'people create error';
      }
      console.log('person Doug created', data.id);
      _ids.Doug = data.id;
      done();
    });
  });

  afterEach(done => {
    console.log('after: remove doug ', _ids.Doug);
    people.remove(_ids.Doug, {}, (error) => {
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
  baseTests(people, _ids, errors.types);
});
