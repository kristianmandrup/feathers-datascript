import { default as d } from 'datascript';

export default class DataScriptAdapter {
  constructor(options = {}) {
    console.log('creating DataScriptAdapter');
    this.options = options;
    this.db = this.emptyDb(options.schema || {}, options.data || []);
    this.connection = d.conn_from_db(this.db);
    this.addListeners();
  }

  addListeners() {
    d.listen(this.connection, (report) => {
      console.log('Tx Report', report);
    });
  }

  _log(...args) {
    console.log('DataScriptAdapter', ...args);
  }

  emptyDb(options) {
    this._log('create empty DB', options);
    return d.empty_db(options.schema, options.data || []);
  }

  q(query, connection) {
    this._log('q', query);
    return d.q(query, connection);
  }

  // do we need a callback?
  transact(connection, statement) {
    this._log('transact', statement);
    return d.transact(connection, statement);
  }
}

