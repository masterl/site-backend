const R = require('ramda');

module.exports = (first, second) => {

  return R.equals(0, R.length(R.without(first, second))) && R.equals(0, R.length(R.without(second, first)));
};
