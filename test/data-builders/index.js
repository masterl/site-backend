const fs       = require('fs');
const path     = require('path');

const builders = {};

fs.readdirSync(__dirname)
  .filter(ignore_bad_ext_files)
  .filter(ignore_folders)
  .forEach(file => {
    const raw_builder_name = file.split('.')[0];

    const builder_name = normalize_name(raw_builder_name);

    builders[builder_name] = require(path.join(__dirname, file));
  });

module.exports = builders;

function ignore_folders (file) {
  return fs.lstatSync(`${__dirname}/${file}`).isFile();
}

function ignore_bad_ext_files (file) {
  return ((file.indexOf('.') !== 0) && (file !== 'index.js'));
}

function normalize_name (raw_name) {
  const name = raw_name.split('_')
    .map(capitalize_first_letter)
    .join('');

  return name + 'Builder';
}

function capitalize_first_letter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
