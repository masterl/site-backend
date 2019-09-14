const moment   = require('moment');
const rfr      = require('rfr');
const { Post } = rfr('models');

const generate_large_text = () => faker.lorem.words(150);

const generate_status = () => {
  const valid_status = [
    'draft',
    'published',
    'hidden',
    'scheduled'
  ];

  return faker.random.arrayElement(valid_status);
};

const generate_future_date = () => moment.utc().add(5, 'days');

generate_future_date();

module.exports = class PostBuilder {
  static random_post_info (options = {}) {
    const status = options.status || generate_status();
    let publish_on = null;

    if (status === 'scheduled') {
      publish_on = generate_future_date();
    }

    delete options.status;
    delete options.publish_on;

    return Object.assign({
      title:      faker.lorem.sentence(),
      body:       generate_large_text(),
      status,
      publish_on: options.publish_on || publish_on
    }, options);
  }

  static create_one (options = {}) {
    return Post.create(this.random_post_info(options));
  }

  static create_many (user, quantity) {
    if (!user) {
      return Promise.reject(new Error('You should provide the creating user!'));
    }

    const promises = R.range(0, quantity)
      .map(() => this.random_post_info({ user_id: user.id }))
      .map(post_info => Post.create(post_info));

    return Promise.all(promises);
  }
};
