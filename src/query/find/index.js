// See: Attributes
// http://www.learndatalogtoday.org/chapter/4
// find all attributes that are associated with person entities
// but this would give me attribute names only I think?
// [:find ?attr
//  :where
//  [?p :entity/person]
//  [?p ?a]
//  [?a :db/ident ?attr]]

// find all attribute values of a given entity type
// [:find ?a
//  :in $ [?type]
//  :where
//  [?p :entity/person ?type]
//  [?p ?attr ?a]

import { toTupleObjList } from '../../util';
import Only from './only';
import Selector from './selector';

export default class Find {
  constructor(params) {
    if (typeof params === 'object') {
      params = toTupleObjList(params);
    }
    this.params = params;
    this.selector = new Selector(this.params);
  }

  build() {
    return this[this.selector.type]().join(' ');
  }

  // for $select: '*'

  // [:find ?a ?v :in $ ?e :where [?e ?a ?v]] - @ashnur
  all() {
    return {
      find: ['?a', '?v'],
      // in: '$ ?e'
      where: ['?e', '?a', '?v']
    };
  }

  // NOT supported yet
  // except() {}
  //   this.attrs = this.set.except;
  //   return {};
  // }

  only() {
    return new Only(this.selector.attrs).build()[':find'];
  }
}