import chai from 'chai';
import Or from '../../src/query/where/clauses/or';

let expect = chai.expect;

describe('Or', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('name == "kris" or age > 32', done => {
    let or = new Or({
      name: 'kris',
      age: {$gt: 32}
    });
    let expected = `(or ([?eid ?name 'kris']) (> [?eid ?age 32]))`;

    expect(or.where).to.eql(expected);
    expect(or.build()).to.eql({
      ':where': expected
    });
    done();
  });
});
