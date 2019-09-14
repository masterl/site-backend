const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const load_routes  = require('./util/load_routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

load_routes(path.join(__dirname, 'routes'), app);

app.use((error, req, res, next) => {
  const { status_code, message } = error;

  res.status(status_code).json({ message }).end();
});

module.exports = app;
