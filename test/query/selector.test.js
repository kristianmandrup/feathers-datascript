import chai from 'chai';
import Selector from '../../src/query/find/selector';

let expect = chai.expect;

describe('Selector', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('select all', done => {
    let attrs = [];
    let selector = new Selector({$select: attrs});
    expect(selector).to.be.an.instanceof(Selector);
    expect(selector.attrs).to.eq(attrs);
    expect(selector.type).to.eq('all');
    done();
  });

  it('email and name only', done => {
    let attrs = ['email', 'name'];
    let selector = new Selector({$select: attrs});
    expect(selector).to.be.an.instanceof(Selector);
    expect(selector.attrs).to.eq(attrs);
    expect(selector.type).to.eq('only');
    done();
  });
});
