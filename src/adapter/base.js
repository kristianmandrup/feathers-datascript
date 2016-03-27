import util from './util';

export default class BaseAdapter {
  constructor(options = {}) {
    this.d = options.d;
    this.options = options;
  }

  createEmptyDb() {
  }

  createConnection() {
  }

  get name() {
    return this.constructor.name;
  }

  addListeners() {
    this.d.listen(this.connection, (report) => {
      console.log('Tx Report', report);
    });
  }

  _log(...args) {
    console.log(this.name, ...args);
  }

  // connection
  q(query) {
    // var ednQuery = edn.parse(query);
    this._log('q', query);
  }

  performQuery(query) {
    throw 'Not implemented';
  }

  performPull(query) {
    throw 'Not implemented';
  }

  // do we need a callback?
  transact(statement) {
    if (!statement.length) {
      statement = [statement];
      statement = statement.map(transaction => {
        return util.toArray(transaction);
      });
    }
    this._log('transact', statement);
    this.performTransaction(statement);
  }

  performTransaction(statement) {
    throw 'Not implemented';
  }
}

