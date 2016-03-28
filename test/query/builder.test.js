import chai from 'chai';
import Builder from '../../src/query/where/builder';

let expect = chai.expect;

describe('Builder', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('Builder: > 32', done => {
    let builder = new Builder('age', {$gt: 32});
    expect(builder.build()).to.eql(`[(> [?eid ?age 32])]`);
    done();
  });

  it('Builder: < 32', done => {
    let builder = new Builder('age', {$lt: 32});
    expect(builder.build()).to.eql(`[(< [?eid ?age 32])]`);
    done();
  });

  it('Builder: = 32', done => {
    let builder = new Builder('age', {$eq: 32});
    expect(builder.build()).to.eql(`[?eid ?age 32]]`);
    done();
  });
});
