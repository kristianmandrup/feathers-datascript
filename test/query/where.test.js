import chai from 'chai';

let expect = chai.expect;

describe('Where', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('number', done => {
    expect(typeof 1).to.equal('number');
    done();
  });
});
