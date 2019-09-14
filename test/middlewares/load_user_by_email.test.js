const load_user_by_email = rfr('middlewares/load_user_by_email');

const { User, sequelize } = rfr('models');
const { NotFoundError } = rfr('lib/errors');

const { ReqBuilder, ResBuilder, UserBuilder } = builders;
const { delay_check, should_have_called_next_with_error } = helpers;

after(() => {
  return sequelize.close();
});

describe('load_user_by_email middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = ReqBuilder.create();
    res = ResBuilder.create();
    next = sinon.spy();

    res.init_spies();

    return User.truncateCascade();
  });

  afterEach(() => {
    res.destroy_spies();
  });

  describe('when user doesn\'t exist', () => {
    let user_info;

    beforeEach(() => {
      user_info = UserBuilder.random_user_info();
    });

    it('should call next', done => {
      req.body.email = user_info.email;

      load_user_by_email(req, res, next);

      delay_check(() => {
        expect(next.calledOnce).to.be.true;
        done();
      });
    });

    it('should call next with NotFoundError', done => {
      req.body.email = user_info.email;

      load_user_by_email(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new NotFoundError());

        done();
      });
    });
  });

  describe('when user exists', () => {
    let user_info;
    let user;

    beforeEach(() => {
      user_info = UserBuilder.random_user_info();

      return UserBuilder.create_one(user_info)
        .then(new_user => (user = new_user));
    });

    it('should have called next without parameters', done => {
      req.body.email = user_info.email;

      load_user_by_email(req, res, next);

      delay_check(() => {
        expect(next.calledOnce).to.be.true;
        expect(next.args[0]).to.have.length(0);

        done();
      });
    });

    it('should have placed user on res.locals.user', done => {
      req.body.email = user_info.email;

      load_user_by_email(req, res, next);

      delay_check(() => {
        expect(next.calledOnce).to.be.true;

        expect(res.locals.user).to.exist;
        expect(res.locals.user.id).to.be.equal(user.id);
        expect(res.locals.user.email).to.be.equal(user.email);
        expect(res.locals.user.name).to.be.equal(user.name);
        expect(res.locals.user.password).to.be.equal(user.password);

        done();
      });
    });
  });
});
