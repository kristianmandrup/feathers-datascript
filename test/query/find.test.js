import chai from 'chai';
import Find from '../../src/query/find';
import Selector from '../../src/query/find/selector';

let expect = chai.expect;

describe('Find', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('empty find', done => {
    let find = new Find();
    expect(find).to.be.an.instanceof(Find);
    expect(find.selector).to.be.an.instanceof(Selector);
    done();
  });

  it('email only', done => {
    let find = new Find({$select: {email: 1}});
    console.log('email only', find);
    expect(find).to.be.an.instanceof(Find);
    expect(find.selector).to.be.an.instanceof(Selector);
    expect(find.build()).to.eq({find: ''});
    done();
  });

  it('all except email', done => {
    let find = new Find({$select: {email: -1}});
    console.log('except email', find);
    expect(find).to.be.an.instanceof(Find);
    expect(find.selector).to.be.an.instanceof(Selector);
    expect(find.build()).to.eq({find: ''});
    done();
  });
});
