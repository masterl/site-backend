const { User, sequelize } = rfr('models');

const UserBuilder = builders.UserBuilder;
const copy_obj    = helpers.copy_obj;

after(() => {
  return sequelize.close();
});

describe('User', () => {
  after(() => {
    return User.truncate({ cascade: true });
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

  describe('editing a user', () => {
    let user;
    let new_info;

    beforeEach(() => {
      new_info = UserBuilder.random_user_info();

      return User.truncate({ cascade: true })
        .then(() => UserBuilder.create_one())
        .then(new_user => (user = new_user));
    });

    it('should encrypt new password', () => {
      user.password = new_info.password;

      const new_password = copy_obj(new_info).password;

      return user.save()
        .then(user => {
          expect(user.password).to.not.be.equal(new_password);
        });
    });

    it('shouldn\'t re-encrypt password if it hasn\'t changed', () => {
      user.email = new_info.email;

      const old_password = Object.assign({ password: user.password }).password;

      return user.save()
        .then(user => {
          expect(user.password).to.be.equal(old_password);
        });
    });
  });
});
