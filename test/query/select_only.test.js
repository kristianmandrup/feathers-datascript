import chai from 'chai';
import Only from '../../src/query/find/only';

let expect = chai.expect;

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
    let expected = [
      '?e ?email ?email-value',
      '?e ?name ?name-value'
    ];
    let where = only._whereClauses();
    for (let val of expected) {
      expect(where).to.include(val);
    }
    // expect(only._findAttrs()).to.eq(attrs);
    done();
  });
});
