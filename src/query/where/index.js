import Builder from './builder';

export default class Where {
  constructor(params) {
    this.params = params;
  }

  build() {
    return params.map(param => {
      return new Builder(param).build();
    });
  }
}
