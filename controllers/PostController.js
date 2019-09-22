const rfr        = require('rfr');
const HttpStatus = require('http-status-codes');

const { Post }        = rfr('models');
const { ServerError } = rfr('lib/errors');

class PostController {
  static async create (req, res, next) {
    console.log('Post create');
    try {
      req.body.user_id = res.locals.acting_user_token.user_id;

      const new_post = await Post.create(req.body);

      res.status(HttpStatus.OK).json(new_post);
    } catch (error) {
      next(new ServerError());
    }
  }

  static async update (req, res, next) {
    const post = await Post.findByPk(req.params.id);

    await post.update(req.body);

    res.status(HttpStatus.OK).json({});
  }
}

module.exports = PostController;
