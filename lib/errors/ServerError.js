const HttpStatus = require('http-status-codes');

const GenericError = require('./GenericError');

class ServerError extends GenericError {
  constructor (message = 'Something broke.') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
