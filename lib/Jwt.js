const Bluebird         = require('bluebird');
const { readFileSync } = require('fs');
const jwt              = Bluebird.promisifyAll(require('jsonwebtoken'));

const { AUTH_PRIV_KEY_PATH, AUTH_PUB_KEY_PATH } = process.env;

const private_key = readFileSync(AUTH_PRIV_KEY_PATH);
const public_key = readFileSync(AUTH_PUB_KEY_PATH);

const algorithm = 'RS256';

class Jwt {
  static async encode (data, options = {}) {
    const jwt_options = {
      algorithm
    };

    if (options.expiresIn) {
      jwt_options.expiresIn = options.expiresIn;
    }

    return jwt.signAsync(data, private_key, jwt_options);
  }

  static async decode (token) {
    return jwt.verifyAsync(token, public_key, { algorithms: [algorithm] });
  }
}

module.exports = Jwt;
