const { ServerError } = rfr('lib/errors');

describe('ServerError', () => {
  describe('when no parameters are passed', () => {
    let error;

    beforeEach(() => {
      error = new ServerError();
    });

    it('should default name to ServerError', () => {
      expect(error.name).to.be.equal('ServerError');
    });

    it(`should default status to ${HttpStatus.INTERNAL_SERVER_ERROR}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should default message to \'Something broke.\'', () => {
      expect(error.message).to.be.equal('Something broke.');
    });
  });

  describe('when a message is set', () => {
    let error;
    const message = 'Some message!';

    beforeEach(() => {
      error = new ServerError(message);
    });

    // redundant test for security
    it(`should keep status_code as ${HttpStatus.INTERNAL_SERVER_ERROR}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
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
      error = new ServerError(message, status_code);
    });

    it('should ignore the status code', () => {
      expect(error.status_code).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
