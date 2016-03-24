import Builder from './builder';

export default class Where {
  constructor(params) {
    this.params = params;
  }

  build() {
    return this.params.map(param => {
      return new Builder(param).build();
    });
  }
}
