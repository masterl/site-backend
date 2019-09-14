const fs       = require('fs');
const path     = require('path');

const errors = {};

fs.readdirSync(__dirname)
  .filter(ignore_bad_ext_files)
  .filter(ignore_folders)
  .forEach(file => {
    const error_name = file.split('.')[0];

    errors[error_name] = require(path.join(__dirname, file));
  });

module.exports = errors;

function ignore_folders (file) {
  return fs.lstatSync(`${__dirname}/${file}`).isFile();
}

function ignore_bad_ext_files (file) {
  return ((file.indexOf('.') !== 0) && (file !== 'index.js'));
}
