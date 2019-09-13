const moment = require('moment');

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
};
