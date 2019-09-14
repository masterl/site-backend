class Res {
  constructor (options = {}) {
    this.status = options.status || (() => this);
    this.json = options.json || (() => this);
    this.end = options.end || (() => this);
    this.locals = options.locals || {};
  }

  init_spies () {
    this.status = sinon.spy(this, 'status');
    this.json = sinon.spy(this, 'json');
  }

  destroy_spies () {
    this.status.restore();
    this.json.restore();
  }
}

class ResBuilder {
  static create (options = {}) {
    return new Res(options);
  }
}

module.exports = ResBuilder;
