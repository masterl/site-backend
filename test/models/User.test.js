const { User, sequelize } = rfr('models');

const UserBuilder = builders.UserBuilder;
const copy_obj    = helpers.copy_obj;

after(() => {
  return sequelize.close();
});

describe('User', () => {
  after(() => {
    return User.truncate();
  });

  describe('model', () => {
    const model_attributes = Object.keys(User.rawAttributes);
    const required_attributes = [
      'id',
      'email',
      'password',
      'created_at',
      'updated_at'
    ];

    required_attributes.map(attribute => {
      it(`should have '${attribute}' field`, () => {
        expect(model_attributes).to.include(attribute);
      });
    });
  });

  describe('creating one with valid info', () => {
    let user_info;

    beforeEach(() => {
      user_info = UserBuilder.random_user_info();
    });

    it('should create new user', done => {
      expect(User.create(user_info)).to.eventually.be.fulfilled.notify(done);
    });

    it('should have encrypted user password', () => {
      const original_info = copy_obj(user_info);

      return User.create(user_info)
        .then(user => {
          expect(user.password).to.not.be.equal(original_info.password);
        });
    });
  });

  describe('creating one with invalid info', () => {
    let user_info;

    beforeEach(() => {
      user_info = UserBuilder.random_user_info();
    });

    it('should reject if email is null', done => {
      delete user_info.email;
      expect(User.create(user_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if password is null', done => {
      delete user_info.password;
      expect(User.create(user_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if email is empty string', done => {
      user_info.email = '';
      expect(User.create(user_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if password is empty string', done => {
      user_info.password = '';
      expect(User.create(user_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if email is not an email', done => {
      user_info.email = 'oi';
      expect(User.create(user_info)).to.eventually.be.rejected.notify(done);
    });
  });
});
