import { default as d } from 'datascript';
// import edn from 'jsedn';
// import util from 'util';

function toArray(obj) {
  console.log('toArray', obj);
  if (obj.length) {
    return obj; // already an array
  }
  const keys = Object.keys(obj);
  var arr = keys.reduce((prev, key) => {
    console.log('concat', prev, key);
    return prev.concat([key, obj[key]]);
  }, []);
  console.log('arr', arr);
  return arr;
}

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

  // connection
  q(query) {
    // var ednQuery = edn.parse(query);
    this._log('q', query);
    return d.q(query, this.db);
  }

  // do we need a callback?
  transact(statement) {
    if (!statement.length) {
      statement = [statement];
      statement = statement.map(transaction => {
        return toArray(transaction);
      });
    }

    this._log('transact', statement);
    return d.transact(this.connection, statement);
  }
}

