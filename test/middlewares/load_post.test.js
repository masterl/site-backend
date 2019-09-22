const load_post = rfr('middlewares/load_post');

const { User, sequelize } = rfr('models');
const { NotFoundError }   = rfr('lib/errors');

const { ReqBuilder, ResBuilder, UserBuilder, PostBuilder } = builders;
const {
  delay_check,
  should_have_called_next_with_error
} = helpers;

after(() => {
  return sequelize.close();
});

describe('load_post middleware', () => {
  let req;
  let res;
  let next;
  let post;

  beforeEach(() => {
    req = ReqBuilder.create();
    res = ResBuilder.create();
    next = sinon.spy();

    res.init_spies();
  });

  afterEach(() => {
    res.destroy_spies();
  });

  describe('when the post exists', () => {
    beforeEach(() => {
      return User.truncateCascade()
        .then(() => UserBuilder.create_one())
        .then(new_user => PostBuilder.create_one({ user_id: new_user.id }))
        .then(new_post => (post = new_post.get({ plain: true })));
    });

    it('should load post on res.locals.target_post', done => {
      req.params.target_post_id = post.id;
      load_post(req, res, next);

      delay_check(() => {
        expect(res.locals.target_post).to.exist;
        expect(res.locals.target_post.title).to.equal(post.title);

        done();
      });
    });
  });

  describe('when the post doesn\'t exist', () => {
    beforeEach(() => User.truncateCascade());

    it('should reject', done => {
      req.params.target_post_id = 38;
      load_post(req, res, next);

      delay_check(() => {
        should_have_called_next_with_error(next, new NotFoundError());

        done();
      });
    });
  });
});
