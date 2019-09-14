const rfr        = require('rfr');
const Jwt        = rfr('lib/Jwt');
const HttpStatus = require('http-status-codes');
const { User }   = rfr('models');

module.exports = class AuthController {
  static login (req, res) {
    return User.find_by_email(req.body.email)
      .then(user => Jwt.encode({ user_id: user.id }, { expiresIn: '1day' }))
      .then(token => res.status(HttpStatus.OK).json({ token }));
  }
};
