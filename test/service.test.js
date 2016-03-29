import Service from '../src';
import chai from 'chai';

let expect = chai.expect;

describe('Service', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });
  let service = new Service('person');

  it('finds people named kris, aged 32', done => {

    let result = service.find({
      name: 'kris',
      age: {$gt: 32}
    });

    expect(result).to.eql([
      {name: 'kris', age: 41},
    ]);
    done();
  });

  it('find people named kris older than 32', done => {
    service = new Service('person', {mode: 'inline'});
    let result = service.find({
      name: 'kris',
      age: {$gt: 32}
    }, {mode: 'pass'});

    expect(result).to.eql([
      {name: 'kris', age: 41},
    ]);
    done();
  });

  it('pulls person entity with id: 27', done => {
    let result = service.get(27);
    expect(result).to.eql([
      {name: 'janice', age: 25},
    ]);
    done();
  });
});
