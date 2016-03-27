import chai from 'chai';
import Predicate from '../../src/query/where/clauses/predicate';
import Builder from '../../src/query/where/builder';

let expect = chai.expect;

describe('Predicate', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  it('Builder: > 32', done => {
    let builder = new Builder('age', {$gt: 32});
    expect(builder.build()[':where']).to.eql(`[(> [?eid ?age 32])]`);
    done();
  });

  // it('age > 32', done => {
  //   let pred = new Predicate('age', {$gt: 32});
  //   expect(pred._where).to.eql(`[(> ?eid ?age 32)]`);
  //   // expect(pred.build()).to.eql(`[?eid ?name 'kris']`);
  //   done();
  // });

});
