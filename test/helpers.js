const fs  = require('fs');
const rfr = require('rfr');

const copy_obj = rfr('util/copy_obj');

const create_file = (file_path, contents = '') => fs.writeFileSync(file_path, contents);

const delay_check = (some_function, delay = 60) => setTimeout(some_function, delay);

const should_have_called_next_with_error = (next, error) => {
  expect(next.calledWith(error), 'Should have called next with error object').to.be.true;
};

// class TestError {
//   constructor () {
//     this.message = 'This a stub error class for testing!';
//     this.is_test = true;
//   }
// }

module.exports = {
  copy_obj,
  create_file,
  delay_check,
  should_have_called_next_with_error
  // TestError
};
