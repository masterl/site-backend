const rfr     = require('rfr');
const express = require('express');
const router  = express.Router();

const AuthController = rfr('controllers/AuthController');

const load_user_by_email = rfr('middlewares/load_user_by_email');
const validate_login_info = rfr('middlewares/validate_login_info');

router.post('/login', validate_login_info, load_user_by_email, AuthController.login);

module.exports = router;
