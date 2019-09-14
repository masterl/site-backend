const { NotFoundError } = rfr('lib/errors');

describe('NotFoundError', () => {
  describe('when no parameters are passed', () => {
    let error;

    beforeEach(() => {
      error = new NotFoundError();
    });

    it('should default name to NotFoundError', () => {
      expect(error.name).to.be.equal('NotFoundError');
    });

    it(`should default status to ${HttpStatus.NOT_FOUND}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.NOT_FOUND);
    });

    it('should default message to \'Resource not found.\'', () => {
      expect(error.message).to.be.equal('Resource not found.');
    });
  });

  describe('when a message is set', () => {
    let error;
    const message = 'Some message!';

    beforeEach(() => {
      error = new NotFoundError(message);
    });

    // redundant test for security
    it(`should keep status_code as ${HttpStatus.NOT_FOUND}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.NOT_FOUND);
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
      error = new NotFoundError(message, status_code);
    });

    it('should ignore the status code', () => {
      expect(error.status_code).to.be.equal(HttpStatus.NOT_FOUND);
    });
  });
});
