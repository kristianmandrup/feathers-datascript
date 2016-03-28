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

  let query = new Query({
    name: 'kris',
    age: {$gt: 32}
  });
  let built = query.build();
  let q = built.query;
  let params = built.params;

  let whereClauses = [
      '[?e ?name ?name-value]',
      '[(> ?e ?age ?age-value)]'
  ];

  let expected = {
    ':find': `?name-value ?age-value`,
    ':in': `?name-value ?age-value`,
    ':where': whereClauses
  };

  it('builds :find clause', done => {
    // ':find': '?name-value ?age-value',
    // ':in': '$ ?name ?age',
    expect(q[':find']).to.eql(expected[':find']);
    done();
  });

  it('builds :in clause', done => {
    // ':find': '?name-value ?age-value',
    // ':in': '$ ?name ?age',
    expect(q[':in']).to.eql(expected[':in']);
    done();
  });

  it('builds :where clause', done => {
    // ':find': '?name-value ?age-value',
    // ':in': '$ ?name ?age',
    expect(q[':where']).to.eql(expected[':where']);
    done();
  });

  it('builds param values', done => {
    // ':find': '?name-value ?age-value',
    // ':in': '$ ?name ?age',
    expect(params).to.eql(['kris', 32]);
    done();
  });

  it('builds full query', done => {
    // ':find': '?name-value ?age-value',
    // ':in': '$ ?name ?age',
    expect(q).to.eql(expected);
    done();
  });
});
