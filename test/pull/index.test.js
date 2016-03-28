import Pull from '../../src/pull';
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
    let pull = new Pull('person', {id: 27});
    expect(pull.build()).to.eql({
      pattern: ['*'],
      entities: [{':person/id': 27}]
    });
    done();
  });
});
