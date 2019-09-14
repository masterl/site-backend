const R = require('ramda');

module.exports = class RandomObjectBuilder {
  static random_obj () {
    const obj = {};

    this.addStrings(obj);
    this.addArrays(obj);

    return obj;
  }

  static addStrings (obj) {
    const quantity = this.random_number_between(1, 5);

    R.range(0, quantity)
      .map(() => {
        obj[faker.lorem.word()] = faker.lorem.sentence();
      });
  }

  static addArrays (obj) {
    const quantity = this.random_number_between(1, 5);

    R.range(0, quantity)
      .map(() => {
        obj[faker.lorem.word()] = R.range(0, this.random_number_between(1, 6));
      });
  }

  static random_number_between (lower_limit, upper_limit) {
    const range = upper_limit - lower_limit + 1;

    return (Math.random() * 10000) % range;
  }
};
