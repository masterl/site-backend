'use strict';

const tmp     = Bluebird.promisifyAll(require('tmp'));
const TmpFile = require('./tmp_file.builder');

tmp.setGracefulCleanup();

module.exports = {
  create_one_empty,
  create_one_with_files
};

function get_directory_options (options = {}) {
  return {
    keep:          options.keep || false,
    mode:          options.mode || 0o750,
    prefix:        options.prefix || 'test_dir_',
    dir:           options.dir,
    unsafeCleanup: options.unsafeCleanup || true
  };
}

function create_one_empty (options = {}) {
  options = get_directory_options(options);

  return tmp.dirAsync(options);
}

function get_inner_files_options (dir_path, options = {}) {
  return {
    keep:     options.file_keep || false,
    mode:     options.file_mode || 0o600,
    dir:      `${dir_path}/`,
    postfix:   options.file_extension || '.tmp',
    contents: options.file_contents || ''
  };
}

function create_one_with_files (file_count = 3, options = {}) {
  const dir_options = get_directory_options(options);
  let file_options;

  const new_dir = {
    path:        '',
    inner_files: []
  };

  return create_one_empty(dir_options)
    .then(path => (new_dir.path = path))
    .then(() => (file_options = get_inner_files_options(new_dir.path, options)))
    .then(() => Bluebird.map(R.range(0, file_count), R.partial(TmpFile.create_one, [file_options])))
    .then(files => (new_dir.inner_files = files))
    .then(() => new_dir);
}
