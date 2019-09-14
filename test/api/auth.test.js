const app                 = rfr('app');
const { User, sequelize } = rfr('models');
const Jwt                 = rfr('lib/Jwt');

const { UserBuilder } = builders;

after(() => {
  return sequelize.close();
});

describe('API auth', () => {
  describe('logging in with valid info', () => {
    let user_info;

    beforeEach(() => {
      user_info = UserBuilder.random_user_info();

      return User.truncateCascade()
        .then(() => UserBuilder.create_one(user_info));
    });

    it('should return a token', () => {
      return request(app)
        .post('/api/auth/login')
        .send({
          email:    user_info.email,
          password: user_info.password
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then(response => {
          const { body } = response;

          expect(body.token).to.exist;
          expect(body.token).to.match(/^([^.]+\.){2}[^.]+$/);
        });
    });

    it('returned token should contain the user id', done => {
      request(app)
        .post('/api/auth/login')
        .send({
          email:    user_info.email,
          password: user_info.password
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then(response => {
          const { body } = response;

          return Jwt.decode(body.token)
            .then(data => expect(data.user_id).to.exist)
            .then(() => done());
        })
        .catch(done);
    });
  });

  describe('logging in with invalid info', () => {
    let user_info;

    beforeEach(() => {
      user_info = UserBuilder.random_user_info();

      return User.truncateCascade()
        .then(() => UserBuilder.create_one(user_info));
    });

    it('should reject if email is empty string', () => {
      return request(app)
        .post('/api/auth/login')
        .send({
          email:    '',
          password: user_info.password
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should reject if password is empty string', () => {
      return request(app)
        .post('/api/auth/login')
        .send({
          email:    user_info.email,
          password: ''
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should reject if email isn\'t informed', () => {
      return request(app)
        .post('/api/auth/login')
        .send({
          password: user_info.password
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should reject if password isn\'t informed', () => {
      return request(app)
        .post('/api/auth/login')
        .send({
          email:    user_info.email
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should reject if email is invalid', () => {
      return request(app)
        .post('/api/auth/login')
        .send({
          email:    'chapolim@wrong',
          password: user_info.password
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should reject if password is wrong', () => {
      return request(app)
        .post('/api/auth/login')
        .send({
          email:    user_info.email,
          password: 'some wrong password'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
