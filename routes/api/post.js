const rfr     = require('rfr');
const express = require('express');
const PostController = rfr('controllers/PostController');

const ensure_user_is_logged = rfr('middlewares/ensure_user_is_logged');
const load_post = rfr('middlewares/load_post');

const router = express.Router();

router.post('/', ensure_user_is_logged, PostController.create);
router.put('/:target_post_id', ensure_user_is_logged, load_post, PostController.update);

module.exports = router;
