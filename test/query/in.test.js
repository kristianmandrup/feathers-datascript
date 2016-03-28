import chai from 'chai';
import In from '../../src/query/in';

let expect = chai.expect;

describe('In', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('empty in', done => {
    let ins = new In();
    expect(ins).to.be.an.instanceof(In);
    expect(ins.build()).to.eql([]);
    done();
  });
});
