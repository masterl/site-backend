const faker = require('faker');
const rfr   = require('rfr');
const User  = rfr('models').User;

module.exports = class UserBuilder {
  static random_user_info (options = {}) {
    return Object.assign({
      name:     this.generate_name(),
      email:    faker.internet.email(),
      password: faker.internet.password()
    }, options);
  }

  static create_one (options) {
    return User.create(this.random_user_info(options));
  }

  static generate_name () {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();

    return `${first_name} ${last_name}`;
  }
};
