module.exports = class PostBuilder {
  static random_post_info () {
    return {
      title: faker.lorem.sentence(),
      body:  faker.lorem.text()
    };
  }
};
