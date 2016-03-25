import { datascript as d } from 'datascript';

export default class DataScriptAdapter {
  constructor(options = {}) {
    this.db = d.empty_db(options.schema, options.data || []);
  }

  q(query, connection) {
    return d.q(query, connection);
  }
}

