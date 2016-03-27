import chai from 'chai';

let expect = chai.expect;

describe('Pull', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('pull', done => {
    expect(typeof 1).to.equal('number');
    done();
  });
});
