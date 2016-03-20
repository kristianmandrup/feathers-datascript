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

import Only from './only';
import Selector from './selector';

export default class Find {
  constructor(params) {
    this.params = params;
    this.selector = new Selector(this.params);
  }

  build() {
    return this[this.selector]();
  }

  // for $select: '*'
  all() {
    return {
      find: ['?attribute', '?value'],
      where: ['?e', '?attribute', '?value']
    };
  }

  // NOT supported yet
  except() {}
    this.attrs = this.set.except;
    return {};
  }

  only() {
    return new Only(this.selector.set.only).build();
  }
}