const app                 = rfr('app');
const { User, Post, sequelize } = rfr('models');
const Jwt                 = rfr('lib/Jwt');

const { UserBuilder, PostBuilder } = builders;

after(() => {
  return sequelize.close();
});

describe('API Post', () => {
  let token;
  let post_info;
  let user;
  beforeEach(() => {
    post_info = PostBuilder.random_post_info();

    return User.truncateCascade()
      .then(() => UserBuilder.create_one())
      .then(new_user => (user = new_user));
  });

  describe('creating a new post', () => {
    describe('with valid data', () => {
      beforeEach(() => {
        return Jwt.encode({ id: user.id })
          .then(new_token => (token = new_token));
      });

      it('should succeed if data is valid', () => {
        return request(app)
          .post('/api/post')
          .send(post_info)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.OK);
      });

      it('should have saved post on database', () => {
        return request(app)
          .post('/api/post')
          .send(post_info)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.OK)
          .then(() => {
            return Post.findOne({ where: { title: post_info.title } })
              .then(post => {
                expect(post).to.exist;
              });
          });
      });

      it('should return new post', () => {
        return request(app)
          .post('/api/post')
          .send(post_info)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.OK)
          .then(response => {
            const new_post = response.body;

            expect(new_post.title).to.be.equal(post_info.title);
            expect(new_post.user_id).to.be.equal(user.id);
          });
      });
    });

    describe('when token is expired', () => {
      beforeEach(() => {
        return Jwt.encode({ id: user.id, iat: moment.utc().subtract(20, 'days').unix() }, { expiresIn: '1d' })
          .then(new_token => (token = new_token));
      });

      it('should reject', () => {
        return request(app)
          .post('/api/post')
          .send(post_info)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
