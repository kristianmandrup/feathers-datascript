import chai from 'chai';
import Id from '../../src/query/where/clauses/id';

let expect = chai.expect;

describe('Id', () => {
  // before(clean);
  // after(clean);

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    done();
  });

  let inId = [
    '?id'
  ];

  it('person.id == 27', done => {
    let entityClass = 'person';
    let id = new Id(entityClass, 27);
    let entityIdAttr = `:${entityClass}/id`;

    let whereClause = `[?eid ${entityIdAttr} ?id]`;

    let query = {
      ':find': inId,
      ':in': inId,
      ':where': whereClause
    };

    expect(id._find).to.eql(inId);
    expect(id._in).to.eql(inId);
    expect(id._where).to.eql(whereClause);
    expect(id.build()).to.eql(query);
    done();
  });
});
