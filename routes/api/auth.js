const rfr     = require('rfr');
const express = require('express');
const router  = express.Router();

const AuthController = rfr('controllers/AuthController');

const load_user_by_email = rfr('middlewares/load_user_by_email');

router.post('/login', load_user_by_email, AuthController.login);

module.exports = router;
