const rfr     = require('rfr');
const express = require('express');
const PostController = rfr('controllers/PostController');

const ensure_user_is_logged = rfr('middlewares/ensure_user_is_logged');

const router = express.Router();

router.post('/', ensure_user_is_logged, PostController.create);
router.put('/:id', ensure_user_is_logged, PostController.update);

module.exports = router;
