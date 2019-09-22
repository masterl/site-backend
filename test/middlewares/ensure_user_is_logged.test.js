const ensure_user_is_logged = rfr('middlewares/ensure_user_is_logged');

const { User, sequelize } = rfr('models');
const { BadRequestError, UnauthorizedError } = rfr('lib/errors');
const Jwt                 = rfr('lib/Jwt');

const { ReqBuilder, ResBuilder, RandomTokenBuilder } = builders;
const {
  delay_check,
  should_have_called_next_with_error,
  random_number_between
} = helpers;

after(() => {
  return sequelize.close();
});

describe('ensure_user_is_logged middleware', () => {
  let req;
  let res;
  let next;
  let user_id;
  let token;

  beforeEach(() => {
    req = ReqBuilder.create();
    res = ResBuilder.create();
    next = sinon.spy();

    res.init_spies();

    user_id = random_number_between(1, 50000);

    return Jwt.encode({ id: user_id })
      .then(new_token => (token = new_token));
  });

  afterEach(() => {
    res.destroy_spies();
  });

  describe('when passing a valid token', () => {
    beforeEach(() => {
      req.setHeader('Authorization', `Bearer ${token}`);
    });

    it('should have called next', done => {
      ensure_user_is_logged(req, res, next);

      delay_check(() => {
        expect(next.calledOnce).to.be.true;

        done();
      });
    });

    it('should have put token on res.locals.acting_user_token', done => {
      ensure_user_is_logged(req, res, next);

      delay_check(() => {
        expect(next.calledOnce).to.be.true;
        expect(res.locals.acting_user_token).to.exist;
        expect(res.locals.acting_user_token.id).to.be.equal(user_id);

        done();
      });
    });
  });

  describe('when Authorization header is not informed', () => {
    it('should reject', done => {
      ensure_user_is_logged(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new BadRequestError('Authorization header wasn\'t informed!'));

        done();
      });
    });
  });

  describe('when token isn\'t prefixed by \'Bearer\'', () => {
    beforeEach(() => {
      req.setHeader('Authorization', token);
    });

    it('should reject', done => {
      ensure_user_is_logged(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new BadRequestError('Authorization header is malformed!'));

        done();
      });
    });
  });

  describe('when token wasn\'t signed by the application', () => {
    beforeEach(() => {
      return RandomTokenBuilder.generate({ id: user_id })
        .then(random_token => req.setHeader('Authorization', `Bearer ${random_token}`));
    });

    it('should reject', done => {
      ensure_user_is_logged(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new UnauthorizedError());

        done();
      });
    });
  });

  describe('when token is invalid', () => {
    beforeEach(() => {
      req.setHeader('Authorization', 'Bearer chapolim');
    });

    it('should reject', done => {
      ensure_user_is_logged(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new UnauthorizedError());

        done();
      });
    });
  });
});
