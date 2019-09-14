const rfr = require('rfr');

const { isEmail, isEmpty } = require('validator');

const { BadRequestError } = rfr('lib/errors');

module.exports = (req, res, next) => {
  const { email, password } = req.body;

  if (email_is_invalid(email) || password_is_invalid(password)) {
    return next(new BadRequestError());
  }

  next();
};

function email_is_invalid (email) {
  return !email || !isEmail(email);
}

function password_is_invalid (password) {
  return !password || isEmpty(password);
}
