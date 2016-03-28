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
    let ins = new In([]);
    expect(ins).to.be.an.instanceof(In);
    expect(ins.build()).to.eql({});
    done();
  });

  it('in email, name', done => {
    let ins = new In(['name', 'email']);
    expect(ins).to.be.an.instanceof(In);
    expect(ins.build()).to.eql({
      ':in': `?name ?email`
    });
    done();
  });

  it('in status list, name', done => {
    let status = {status: {$in: ['single', 'divorced']}};
    let ins = new In([status, 'name']);
    expect(ins).to.be.an.instanceof(In);
    expect(ins.build()).to.eql({
      ':in': `[?status ...] ?name`
    });
    done();
  });
});
