const Bluebird = require('bluebird');
const fs       = Bluebird.promisifyAll(require('fs'));
const jwt      = Bluebird.promisifyAll(require('jsonwebtoken'));

let private_key = null;
let public_key = null;
const algorithm = 'RS256';

class Jwt {
  static async encode (data, options = {}) {
    if (!private_key) {
      private_key = await load_key_file(process.env.AUTH_PRIV_KEY_PATH);
    }

    const jwt_options = {};

    if (options.expiresIn) {
      jwt_options.expiresIn = options.expiresIn;
    }

    return sign(data, private_key, jwt_options);
  }

  static async decode (token) {
    if (!public_key) {
      public_key = await load_key_file(process.env.AUTH_PUB_KEY_PATH);
    }

    return jwt.verifyAsync(token, public_key);
  }
}

function sign (data, key, jwt_options) {
  return jwt.signAsync(data, key, Object.assign(jwt_options, { algorithm }));
}

function load_key_file (file_path) {
  return fs.readFileAsync(file_path);
}

module.exports = Jwt;
