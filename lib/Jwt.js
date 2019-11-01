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

    const jwt_options = {
      algorithm
    };

    if (options.expiresIn) {
      jwt_options.expiresIn = options.expiresIn;
    }

    return jwt.signAsync(data, private_key, jwt_options);
  }

  static async decode (token) {
    if (!public_key) {
      public_key = await load_key_file(process.env.AUTH_PUB_KEY_PATH);
    }

    return jwt.verifyAsync(token, public_key, { algorithms: [algorithm] });
  }
}

function load_key_file (file_path) {
  return fs.readFileAsync(file_path);
}

module.exports = Jwt;
