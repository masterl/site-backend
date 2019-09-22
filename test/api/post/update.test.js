const app = rfr('app');
const Jwt = rfr('lib/Jwt');

const { User, Post, sequelize } = rfr('models');

const { UserBuilder, PostBuilder } = builders;

after(() => {
  return sequelize.close();
});

describe('API Post', () => {
  let token;
  let post;
  let user;
  beforeEach(() => {
    const post_info = PostBuilder.random_post_info();

    return User.truncateCascade()
      .then(() => UserBuilder.create_one())
      .then(new_user => (user = new_user))
      .then(() => (post_info.user_id = user.id))
      .then(() => PostBuilder.create_one(post_info))
      .then(new_post => (post = new_post.get({ plain: true })));
  });

  describe('editing a post', () => {
    describe('with valid data', () => {
      beforeEach(() => {
        post.body = `${post.body} changed`;

        return Jwt.encode({ user_id: user.id })
          .then(new_token => (token = new_token));
      });

      it('should accept', () => {
        return request(app)
          .put(`/api/post/${post.id}`)
          .send(post)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.OK);
      });

      it('should accept update on database', () => {
        return request(app)
          .put(`/api/post/${post.id}`)
          .send(post)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.OK)
          .then(() => {
            return Post.findOne({ where: { title: post.title } })
              .then(updated_post => {
                expect(updated_post.body).to.be.equal(post.body);
              });
          });
      });
    });

    describe('when token is expired', () => {
      beforeEach(() => {
        return Jwt.encode({ user_id: user.id, iat: moment.utc().subtract(20, 'days').unix() }, { expiresIn: '1d' })
          .then(new_token => (token = new_token));
      });

      it('should reject', () => {
        return request(app)
          .put(`/api/post/${post.id}`)
          .send(post)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('when post doesn\'t exist', () => {
      beforeEach(() => {
        return Jwt.encode({ user_id: user.id })
          .then(new_token => (token = new_token));
      });

      it('should reject', () => {
        return request(app)
          .put(`/api/post/${post.id + 1}`)
          .send(post)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});
