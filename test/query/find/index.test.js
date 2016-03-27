import chai from 'chai';
import Find from '../../../src/query/find';

let expect = chai.expect;

describe('feathers-datascript', () => {
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
    console.log('find', find);
    expect(find.selector).to.be.an.instanceof(Find);
    done();
  });
});
