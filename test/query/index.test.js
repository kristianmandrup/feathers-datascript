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
    expect(query.build()).to.equal({
      ':find': '?name-value ?age-value',
      ':in': '$ ?name ?age',
      ':where': '[?e ?name ?name-value] [?e ?age ?age-value]'
    });
    done();
  });
});
