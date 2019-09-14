const { GenericError } = rfr('lib/errors');

describe('GenericError', () => {
  describe('when no parameters are passed', () => {
    let error;

    before(() => {
      error = new GenericError();
    });

    it('should default name to GenericError', () => {
      expect(error.name).to.be.equal('GenericError');
    });

    it(`should default status to ${HttpStatus.INTERNAL_SERVER_ERROR}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should default message to \'Unexpected error. Try again later.\'', () => {
      expect(error.message).to.be.equal('Unexpected error. Try again later.');
    });
  });

  describe('when a message is set', () => {
    let error;
    const message = 'Some message';

    beforeEach(() => {
      error = new GenericError(message);
    });

    // redundant test for security
    it(`should keep status_code as ${HttpStatus.INTERNAL_SERVER_ERROR}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should have set the message', () => {
      expect(error.message).to.be.equal(message);
    });
  });

  describe('when a message and a status code are set', () => {
    let error;
    const message = 'Some message';
    const status_code = HttpStatus.NOT_FOUND;

    beforeEach(() => {
      error = new GenericError(message, status_code);
    });

    // redundant test for security
    it('should have set the message', () => {
      expect(error.message).to.be.equal(message);
    });

    it('should have set the status_code', () => {
      expect(error.status_code).to.be.equal(status_code);
    });
  });
});
