class Req {
  constructor () {
    this.params = {};
    this.body = {};
    this.headers = {};
  }

  setHeader (name, value) {
    this.headers[name] = value;
  }

  get (name) {
    return this.headers[name];
  }
}

class ReqBuilder {
  static create (options = {}) {
    const req = new Req();

    if (!R.isNil(options.params)) {
      req.params = options.params;
    }

    if (!R.isNil(options.body)) {
      req.body = options.body;
    }

    if (!R.isNil(options.headers)) {
      req.headers = options.headers;
    }

    return req;
  }
}

module.exports = ReqBuilder;
