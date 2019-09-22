const HttpStatus = require('http-status-codes');

const GenericError = require('./GenericError');

class UnauthorizedError extends GenericError {
  constructor (message = 'Access token is either invalid or expired.') {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
