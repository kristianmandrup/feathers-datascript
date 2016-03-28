import QueryBuilder from '../src/query_builder';
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

  let qBuilder = new QueryBuilder('person');

  it('find: builds query', done => {
    let result = qBuilder.query({
      name: 'kris',
      age: {$gt: 32}
    });

    let q = result.query;
    let params = result.params;

    let whereClauses = [
        '[?e ?name ?name-value]',
        '[(> ?e ?age ?age-value)]'
    ];

    let expected = {
      ':find': `?name-value ?age-value`,
      ':in': `?name-value ?age-value`,
      ':where': whereClauses
    };
    expect(q).to.eql(expected);
    done();
  });

  it('get: pulls entity by Id', done => {
    let q = qBuilder.byId({id: 27});

    expect(q).to.eql({
      pattern: ['*'],
      entities: [{':person/id': 27}]
    });
    done();
  });
});
