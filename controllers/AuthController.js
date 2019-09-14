const rfr        = require('rfr');
const Jwt        = rfr('lib/Jwt');
const HttpStatus = require('http-status-codes');

module.exports = class AuthController {
  static login (req, res) {
    const user = res.locals.user;

    return Jwt.encode({ user_id: user.id }, { expiresIn: '1day' })
      .then(token => res.status(HttpStatus.OK).json({ token }));
  }
};
