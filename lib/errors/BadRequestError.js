const HttpStatus = require('http-status-codes');

const GenericError = require('./GenericError');

class BadRequestError extends GenericError {
  constructor (message = 'One or more parameters are invalid.') {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;
