const generate_large_text = () => faker.lorem.words(150);

const generate_status = () => {
  const valid_status = [
    'draft',
    'published',
    'hidden'
  ];

  return faker.random.arrayElement(valid_status);
};

module.exports = class PostBuilder {
  static random_post_info () {
    return {
      title:  faker.lorem.sentence(),
      body:   generate_large_text(),
      status: generate_status()
    };
  }
};
