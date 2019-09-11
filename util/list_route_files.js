const fs   = require('fs');
const R    = require('ramda');
const path = require('path');

module.exports = list_files;

function list_files (directory) {
  const root_contents = fs.readdirSync(directory);

  const root_files = root_contents.filter(R.partial(is_file, [directory]));
  const subdirectories = R.without(root_files, root_contents);

  const subdirectories_files = R.flatten(subdirectories.map(sub_dir => {
    return list_files(path.join(directory, sub_dir))
      .map(file_path => path.join(sub_dir, file_path));
  }));

  return root_files.concat(subdirectories_files);
};

function is_file (base_dir, file_path) {
  const full_path = path.join(base_dir, file_path);
  const stats = fs.statSync(full_path);

  return stats.isFile();
}
