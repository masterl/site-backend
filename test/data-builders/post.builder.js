
const generate_large_text = () => faker.lorem.words(150);

module.exports = class PostBuilder {
  static random_post_info () {
    return {
      title: faker.lorem.sentence(),
      body:  generate_large_text()
    };
  }
};
