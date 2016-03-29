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

  it('mode: pass', done => {
    let ins = new In(['name', 'email'], {mode: 'pass'});
    expect(ins).to.be.an.instanceof(In);
    expect(ins.build()).to.eql(
      '?name ?name-value ?email ?email-value'
    );
    done();
  });

  it('mode: inline', done => {
    let ins = new In(['name', 'email'], {mode: 'inline'});
    expect(ins).to.be.an.instanceof(In);
    expect(ins.build()).to.eql('?name-value ?email-value');
    done();
  });

  it('in status list, name', done => {
    let status = {status: {$in: ['single', 'divorced']}};
    let ins = new In([status, 'name'], {mode: 'inline'});
    expect(ins).to.be.an.instanceof(In);
    expect(ins.build()).to.eql('[?status-value ...] ?name-value');
    done();
  });
});
