const TmpDir = builders.TmpDirBuilder;

const list_route_files = rfr('util/list_route_files');

describe('list_route_files', () => {
  describe('given a directory containing only files', () => {
    let tmp_dir;
    let files;

    beforeEach(() => {
      return TmpDir.create_one_with_files(3, { file_extension: '.js' })
        .then(tmp_dir_path => (tmp_dir = tmp_dir_path))
        .then(() => Bluebird.map(tmp_dir.inner_files, file => file.path))
        .then(file_list => Bluebird.map(file_list, file => file.replace(`${tmp_dir.path}/`, '')))
        .then(file_list => (files = file_list));
    });

    it('should return file list', () => {
      expect(arrays_are_equal(files, list_route_files(tmp_dir.path))).to.be.true;
    });
  });

  describe('given a directory containing files and subdirectories', () => {
    let tmp_dir;
    let sub_dir;
    let files;

    beforeEach(() => {
      return TmpDir.create_one_with_files(3, { file_extension: '.js' })
        .then(new_tmp_dir => (tmp_dir = new_tmp_dir))
        .then(() => Bluebird.map(tmp_dir.inner_files, file => file.path))
        .then(file_list => Bluebird.map(file_list, file => file.replace(`${tmp_dir.path}/`, '')))
        .then(file_list => (files = file_list))
        .then(() => TmpDir.create_one_with_files(3, { dir: tmp_dir.path, file_extension: '.js' }))
        .then(new_tmp_dir => (sub_dir = new_tmp_dir))
        .then(() => Bluebird.map(sub_dir.inner_files, file => file.path))
        .then(file_list => Bluebird.map(file_list, file => file.replace(`${tmp_dir.path}/`, '')))
        .then(file_list => (files = files.concat(file_list)));
    });

    it('should return file list', () => {
      expect(arrays_are_equal(files, list_route_files(tmp_dir.path))).to.be.true;
    });
  });
});
