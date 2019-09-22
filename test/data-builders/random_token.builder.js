const Bluebird = require('bluebird');
const jwt      = Bluebird.promisifyAll(require('jsonwebtoken'));

class RandomTokenBuilder {
  static generate (data = {}) {
    return jwt.signAsync(data, faker.lorem.sentence().split(' ').join(''));
  }
}

module.exports = RandomTokenBuilder;
