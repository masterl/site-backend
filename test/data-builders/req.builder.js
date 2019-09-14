const DEFAULT_OPTIONS = {
  params: {},
  body:   {}
};

class ReqBuilder {
  static create (options = {}) {
    return R.mergeDeepRight(DEFAULT_OPTIONS, options);
  }
}

module.exports = ReqBuilder;
