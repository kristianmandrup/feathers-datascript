import util from 'util';
import BaseAdapter from './base';
import {datascript as d } from 'datascript';

export default class DataScriptAdapter extends BaseAdapter {
  constructor(options = {}) {
    super(options);
    this.d = this.d || d;
    this.connection = this.d;
  }

  createEmptyDb() {
    return this.connection.empty_db(this.options.schema, this.options.data || []);
  }

  createConnection() {
    return this.connection.conn_from_db(this.db);
  }

  performPull(query) {
    return this.connection.pull(query, this.db);
  }

  performQuery(query) {
    return this.connection.q(query, this.db);
  }

  performTransaction(statement) {
    return this.connection.transact(this.connection, statement);
  }
}


