const list_route_files   = require('./list_route_files');
const path_to_route_base = require('./path_to_route_base');
const path               = require('path');

module.exports = (directory, express_app) => {
  list_route_files(directory)
    .map(file_path => {
      const route_file = path.resolve(path.join(directory, file_path));

      express_app.use(path_to_route_base(file_path), require(route_file));
    });
};
