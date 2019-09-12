const faker = require('faker');

module.exports = class UserBuilder {
  static random_user_info () {
    return {
      email:    faker.internet.email(),
      password: faker.internet.password()
    };
  }
};
