const { UnauthorizedError } = rfr('lib/errors');

describe('UnauthorizedError', () => {
  describe('when no parameters are passed', () => {
    let error;

    beforeEach(() => {
      error = new UnauthorizedError();
    });

    it('should default name to UnauthorizedError', () => {
      expect(error.name).to.be.equal('UnauthorizedError');
    });

    it(`should default status to ${HttpStatus.UNAUTHORIZED}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.UNAUTHORIZED);
    });

    it('should default message to \'Access token is either invalid or expired.\'', () => {
      expect(error.message).to.be.equal('Access token is either invalid or expired.');
    });
  });

  describe('when a message is set', () => {
    let error;
    const message = 'Some message!';

    beforeEach(() => {
      error = new UnauthorizedError(message);
    });

    // redundant test for security
    it(`should keep status_code as ${HttpStatus.UNAUTHORIZED}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.UNAUTHORIZED);
    });

    it('should have set the message', () => {
      expect(error.message).to.be.equal(message);
    });
  });

  describe('when a status_code is passed as second argument', () => {
    let error;
    const message = 'Some message!';
    const status_code = 503;

    beforeEach(() => {
      error = new UnauthorizedError(message, status_code);
    });

    it('should ignore the status code', () => {
      expect(error.status_code).to.be.equal(HttpStatus.UNAUTHORIZED);
    });
  });
});
