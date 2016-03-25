import { default as d } from 'datascript';

export default class DataScriptAdapter {
  constructor(options = {}) {
    console.log('creating DataScriptAdapter');
    this.db = this.emptyDb(options.schema || {}, options.data || []);
    this._connection = d.conn_from_db(this.db);
  }

  get connection() {
    return this._connection;
  }

  _log(...args) {
    console.log('DataScriptAdapter', ...args);
  }

  emptyDb(options) {
    this._log('create empty DB', options, d);
    return d.empty_db(options.schema, options.data || []);
  }

  q(query, connection) {
    this._log('q', query);
    return d.q(query, connection);
  }

  transact(connection, statement) {
    this._log('transact', connection, statement);
    return d.transact(connection, statement);
  }
}

