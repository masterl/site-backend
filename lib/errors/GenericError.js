const HttpStatus = require('http-status-codes');

class GenericError {
  constructor (
    message = 'Unexpected error. Try again later.',
    status_code = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    this.name = 'GenericError';
    this.status_code = status_code;
    this.message = message;
  }
}

module.exports = GenericError;
