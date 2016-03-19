import chai from 'chai';
import baseTests from 'feathers-service-tests';
import { errors } from 'feathers';
import service from '../src';
import { datascript as d } from 'datascript';

let expect = chai.expect;
let _ids = {};
let options = {};
let people = service('people', options);

function clean(done) {
  people.ready.then(function(connection){
      done();
    });
  });
}

describe('feathers-datascript', () => {

  before(clean);
  after(clean);

  beforeEach(done => {
    people.create({
      name: 'Doug',
      age: 32
    }, {}, (error, data) => {
      if (error) {
        console.error(error);
      }
      _ids.Doug = data.id;
      done();
    });
  });

  afterEach(done => {
    people.remove(_ids.Doug, {}, (error) => {
      if (error) {
        console.error(error);
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
