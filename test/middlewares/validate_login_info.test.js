const validate_login_info = rfr('middlewares/validate_login_info');

const { User, sequelize } = rfr('models');
const { BadRequestError } = rfr('lib/errors');

const { ReqBuilder, ResBuilder, UserBuilder } = builders;
const { delay_check, should_have_called_next_with_error } = helpers;

after(() => {
  return sequelize.close();
});

describe('validate_login_info middleware', () => {
  let req;
  let res;
  let next;
  let user_info;

  beforeEach(() => {
    req = ReqBuilder.create();
    res = ResBuilder.create();
    next = sinon.spy();

    res.init_spies();

    user_info = UserBuilder.random_user_info();

    return User.truncateCascade();
  });

  afterEach(() => {
    res.destroy_spies();
  });

  describe('when passing null email', () => {
    it('should call next with BadRequestError', done => {
      req.body.password = user_info.password;

      validate_login_info(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new BadRequestError());

        done();
      });
    });
  });

  describe('when passing null password', () => {
    it('should call next with BadRequestError', done => {
      req.body.email = user_info.email;

      validate_login_info(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new BadRequestError());

        done();
      });
    });
  });

  describe('when passing empty string on email', () => {
    it('should call next with BadRequestError', done => {
      req.body.email = '';
      req.body.password = user_info.password;

      validate_login_info(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new BadRequestError());

        done();
      });
    });
  });

  describe('when passing empty string password', () => {
    it('should call next with BadRequestError', done => {
      req.body.email = user_info.email;
      req.body.password = '';

      validate_login_info(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new BadRequestError());

        done();
      });
    });
  });

  describe('when passing an invalid email', () => {
    it('should call next with BadRequestError', done => {
      req.body.email = 'chapolim@wrong';
      req.body.password = user_info.password;

      validate_login_info(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new BadRequestError());

        done();
      });
    });
  });

  describe('when passing valid data', () => {
    it('should call next without parameters', done => {
      req.body.email = user_info.email;
      req.body.password = user_info.password;

      validate_login_info(req, res, next);

      delay_check(() => {
        expect(next.calledOnce).to.be.true;
        expect(next.args[0]).to.have.length(0);

        done();
      });
    });
  });
});
