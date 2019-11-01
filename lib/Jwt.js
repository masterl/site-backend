const { promisify }    = require('util');
const { readFileSync } = require('fs');
const jwt              = require('jsonwebtoken');

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

const { AUTH_PRIV_KEY_PATH, AUTH_PUB_KEY_PATH } = process.env;

const private_key = readFileSync(AUTH_PRIV_KEY_PATH);
const public_key = readFileSync(AUTH_PUB_KEY_PATH);

const algorithm = 'RS256';

class Jwt {
  static encode (data, options = {}) {
    const jwt_options = {
      algorithm
    };

    if (options.expiresIn) {
      jwt_options.expiresIn = options.expiresIn;
    }

    return signAsync(data, private_key, jwt_options);
  }

  static decode (token) {
    return verifyAsync(token, public_key, { algorithms: [algorithm] });
  }
}

module.exports = Jwt;
