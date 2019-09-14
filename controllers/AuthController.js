const rfr        = require('rfr');
const Jwt        = rfr('lib/Jwt');
const HttpStatus = require('http-status-codes');

const { BadRequestError } = rfr('lib/errors');

module.exports = class AuthController {
  static async login (req, res, next) {
    const user = res.locals.user;
    const { password } = req.body;

    try {
      const passwords_match = await user.check_password(password);

      if (!passwords_match) {
        return next(new BadRequestError());
      }

      const token = await Jwt.encode({ user_id: user.id }, { expiresIn: '1day' });

      res.status(HttpStatus.OK).json({ token });
      next();
    } catch (error) {
      next(error);
    }
  }
};
