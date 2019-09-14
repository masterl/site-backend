const Bluebird = require('bluebird');
const fs       = Bluebird.promisifyAll(require('fs'));
const jwt      = Bluebird.promisifyAll(require('jsonwebtoken'));

let private_key = null;
let public_key = null;
const algorithm = 'RS256';

class Jwt {
  static encode (data, options = {}) {
    let promise = Promise.resolve();

    if (!private_key) {
      promise = promise
        .then(() => load_key_file(process.env.AUTH_PRIV_KEY_PATH))
        .then(file_contents => (private_key = file_contents));
    }

    const jwt_options = {};

    if (options.expiresIn) {
      jwt_options.expiresIn = options.expiresIn;
    }

    return promise.then(() => sign(data, private_key, jwt_options));
  }

  static decode (token) {
    let promise = Promise.resolve();

    if (!public_key) {
      promise = promise
        .then(() => load_key_file(process.env.AUTH_PUB_KEY_PATH))
        .then(file_contents => (public_key = file_contents));
    }

    return promise.then(() => jwt.verifyAsync(token, public_key));
  }
}

function sign (data, key, jwt_options) {
  return jwt.signAsync(data, key, Object.assign(jwt_options, { algorithm }));
}

function load_key_file (file_path) {
  return fs.readFileAsync(file_path);
}

module.exports = Jwt;
