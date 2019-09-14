const rfr     = require('rfr');
const express = require('express');
const router  = express.Router();

const AuthController = rfr('controllers/AuthController');

router.post('/login', AuthController.login);

module.exports = router;
