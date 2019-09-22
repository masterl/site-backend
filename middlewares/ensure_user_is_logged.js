const rfr = require('rfr');

const { BadRequestError, UnauthorizedError } = rfr('lib/errors');
const Jwt = rfr('lib/Jwt');

module.exports = async (req, res, next) => {
  try {
    ensure_header_was_informed(req);
    ensure_header_is_wellformed(req);

    const token = req.get('Authorization').match(/[^ ]+$/)[0];

    const decoded_token = await Jwt.decode(token);

    res.locals.acting_user_token = decoded_token;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError());
    }

    next(error);
  }
};

function ensure_header_was_informed (req) {
  if (!req.get('Authorization')) {
    throw new BadRequestError('Authorization header wasn\'t informed!');
  }
}

function ensure_header_is_wellformed (req) {
  const header = req.get('Authorization');

  if (!/^Bearer .+$/.test(header)) {
    throw new BadRequestError('Authorization header is malformed!');
  }
}
