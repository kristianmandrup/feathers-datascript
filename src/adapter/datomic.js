import util from 'util';
import BaseAdapter from './base';
import { Datomic } from 'datomic';

export default class DatomicAdapter extends BaseAdapter {
  constructor(options = {}) {
    super(options);
    this.d = this.d || this.createRemoteConn();
    this.connection = this.d;
    this.driver = this.d;
    this.addListeners();
    this.createEmptyDb();
  }

  get defaultConnOpts() {
    return {
      host: 'localhost',
      port: 8888,
      db: 'db',
      name: 'database'
    };
  }

  connOpts(opts = {}) {
    return this.defaultConnOpts().map(key => {
      return key || opts[key] || this.options[key];
    });
  }

  addListeners() {    
  }

  createRemoteConn() {
    return new Datomic(this.connOpts());
  }

  createEmptyDb(cb) {
    this.driver.createDb(this.options.name).then(res => {
      // transact: schema and data
      var transactions = [
        this.options.schema || [],
        this.options.data || []
      ];
      this.transact(transactions).then(res => {
        // SUCCESS!
        cb(true);
      }).catch(err => {
        cb(false, err);
      });
    }).catch(err => {
      cb(false, err);
    });
  }

  createConnection(opts) {
    return this.connection;
  }

  performQuery(query) {
    return this.driver.q(query);
  }

  // NOT available in REST API
  // performPull(query)

  performTransaction(statement) {
    return this.driver.transact(statement);
  }
}
