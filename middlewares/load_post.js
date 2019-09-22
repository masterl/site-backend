const rfr = require('rfr');
const { Post } = rfr('models');

const { NotFoundError } = rfr('lib/errors');

module.exports = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.target_post_id);

    if (!post) {
      return next(new NotFoundError());
    }

    res.locals.target_post = post;
    next();
  } catch (error) {
    next(error);
  }
};
