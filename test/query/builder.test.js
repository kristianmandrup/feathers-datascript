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

  // it('Builder: > 32', done => {
  //   let builder = new Builder('age', {$gt: 32});
  //   expect(builder.build()).to.eql(`[(> [?e ?age 32])]`);
  //   done();
  // });
  //
  // it('Builder: < 32', done => {
  //   let builder = new Builder('age', {$lt: 32});
  //   expect(builder.build()).to.eql(`[(< [?e ?age 32])]`);
  //   done();
  // });
  //
  // it('Builder: = 32', done => {
  //   let builder = new Builder('age', {$eq: 32});
  //   expect(builder.build()).to.eql(`[?e ?age 32]]`);
  //   done();
  // });

  it('Builder: name == Alex or gender == female', done => {
    let builder = Builder.create({$or: [
      { name: 'Alex' },
      { gender: 'female' }
    ]});
    expect(builder.build()).to.eql('(or [?e ?name ?name-value] [?e ?gender ?gender-value])');
    done();
  });
});
