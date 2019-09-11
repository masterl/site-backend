'use strict';

const tmp = Bluebird.promisifyAll(require('tmp'));
const fs  = Bluebird.promisifyAll(require('fs'));

module.exports = {
  create_one
};

function get_file_options (options = {}) {
  return {
    keep:    options.keep || false,
    mode:    options.mode || 0o600,
    prefix:  options.prefix || 'test_file_',
    dir:     options.dir || '/tmp',
    postfix: options.postfix || '.tmp'
  };
}

function create_one (options = {}) {
  let file_contents = options.contents;

  if (R.isNil(options.contents)) {
    file_contents = faker.lorem.text;
  }

  const file_options = get_file_options(options);

  const return_value = {
    path: '',
    file_contents
  };

  return tmp.fileAsync(file_options)
    .then(tmp_file_path => (return_value.path = tmp_file_path))
    .then(path => fs.writeFileAsync(path, file_contents))
    .then(() => return_value);
};
