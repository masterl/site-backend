
module.exports = path => {
  if (path === 'index.js') {
    return '/';
  }

  return `/${path.replace(/[.]js$/, '')}`;
};
