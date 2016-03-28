import Query from '../../src/query';
import chai from 'chai';

let expect = chai.expect;

describe('Query', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('build', done => {
    let query = new Query({
      name: 'kris',
      age: {$gt: 32}
    });

    // ':find': '?name-value ?age-value',
    // ':in': '$ ?name ?age',
    let q = query.build()[':where'];

    expect(q).to.equal([
        '[?e ?name ?name-value]',
        '[?e ?age ?age-value]'
    ]);
    done();
  });
});
