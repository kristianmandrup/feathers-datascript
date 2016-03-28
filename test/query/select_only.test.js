import chai from 'chai';
import Only from '../../src/query/find/only';

let expect = chai.expect;

function expectIncluded(expected, list) {
  for (let val of list) {
    expect(expected).to.include(val);
  }
}

describe('Select Only', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('email and name only', done => {
    let attrs = ['email', 'name'];
    let only = new Only(attrs);
    expect(only).to.be.an.instanceof(Only);
    let whereClauses = [
      '?e ?email ?email-value',
      '?e ?name ?name-value'
    ];
    let findAttrs = [
      '?email-value',
      '?name-value'
    ];
    let ins = [
      '?email',
      '?name'
    ];

    let query = {
      ':find': findAttrs,
      ':ins': ins,
      ':where': whereClauses
    };

    expectIncluded(only._find, findAttrs);
    expectIncluded(only._in, ins);
    expectIncluded(only.where, whereClauses);

    expect(only.build()).to.eql(query);
    done();
  });
});
