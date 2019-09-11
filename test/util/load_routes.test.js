'use strict';

const path   = require('path');
const TmpDir = builders.TmpDirBuilder;

const load_routes = rfr('util/load_routes');
const express_path = path.resolve(path.join('node_modules/', 'express'));

const route_file_content = `const express = require('${express_path}');
const router  = express.Router();
router.get('/test_route', function (req, res) {
});
module.exports = router;`;

describe('load_routes', () => {
  describe('given a routes directory containing files and subdirectories', () => {
    let tmp_dir;
    let sub_dir;
    let route_bases;

    beforeEach(() => {
      let files;

      return TmpDir.create_one_with_files(3, { file_extension: '.js', file_contents: route_file_content })
        .then(new_tmp_dir => (tmp_dir = new_tmp_dir))
        .then(() => helpers.create_file(path.join(tmp_dir.path, 'index.js'), route_file_content))
        .then(() => (tmp_dir.inner_files.push({ path: path.join(tmp_dir.path, 'index.js'), contents: route_file_content })))
        .then(() => Bluebird.map(tmp_dir.inner_files, file => file.path))
        .then(file_list => Bluebird.map(file_list, file => file.replace(`${tmp_dir.path}/`, '')))
        .then(file_list => (files = file_list))
        .then(() => TmpDir.create_one_with_files(3, { dir: tmp_dir.path, file_extension: '.js', file_contents: route_file_content }))
        .then(new_tmp_dir => (sub_dir = new_tmp_dir))
        .then(() => Bluebird.map(sub_dir.inner_files, file => file.path))
        .then(file_list => Bluebird.map(file_list, file => file.replace(`${tmp_dir.path}/`, '')))
        .then(file_list => (files = files.concat(file_list)))
        .then(() => files.map(file_path => `/${file_path.replace(/[.]js$/, '')}`))
        .then(result => result.map(file_path => {
          if (file_path === '/index') {
            return '/';
          }

          return file_path;
        }))
        .then(result => (route_bases = result));
    });

    it('should register all routes', () => {
      const app = {
        use: sinon.spy()
      };

      load_routes(tmp_dir.path, app);

      const registered_route_bases = app.use.args.map(call_arguments => call_arguments[0]);

      expect(app.use.callCount).to.be.equal(7);
      expect(arrays_are_equal(route_bases, registered_route_bases)).to.be.true;
    });
  });
});
