const rfr               = require('rfr');
const { NotFoundError } = rfr('lib/errors');

const { User } = rfr('models');

module.exports = (req, res, next) => {
  User.find_by_email(req.body.email)
    .then(user => {
      if (!user) {
        return next(new NotFoundError());
      }

      res.locals.user = user;

      next();
    });
};
