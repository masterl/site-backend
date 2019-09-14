const HttpStatus = require('http-status-codes');

const GenericError = require('./GenericError');

class NotFoundError extends GenericError {
  constructor (message = 'Resource not found.') {
    super(message, HttpStatus.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
