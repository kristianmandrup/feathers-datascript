import BaseAdapter from './base';
import datascript from 'datascript';

export default class DataScriptAdapter extends BaseAdapter {
  constructor(options = {}) {
    super(options);
    this.d = this.d || datascript;
    this.driver = this.d;
    this.db = this.createEmptyDb();
    this.connection = this.createConnection();
    this.addListeners();
  }

  createEmptyDb() {
    return this.driver.empty_db(this.options.schema, this.options.data || []);
  }

  createConnection() {
    return this.driver.conn_from_db(this.db);
  }

  performPull(query) {
    return this.driver.pull(query, this.db);
  }

  performQuery(query, params) {
    return this.driver.q(query, this.db, params || []);
  }

  performTransaction(statement) {
    return this.driver.transact(this.connection, statement);
  }
}


