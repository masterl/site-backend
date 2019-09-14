class ReqBuilder {
  static create (options = {}) {
    const DEFAULT_OPTIONS = {
      params: {},
      body:   {}
    };

    return R.mergeDeepRight(DEFAULT_OPTIONS, options);
  }
}

module.exports = ReqBuilder;
