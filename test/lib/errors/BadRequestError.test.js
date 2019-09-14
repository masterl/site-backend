const { BadRequestError } = rfr('lib/errors');

describe('BadRequestError', () => {
  describe('when no parameters are passed', () => {
    let error;

    beforeEach(() => {
      error = new BadRequestError();
    });

    it('should default name to BadRequestError', () => {
      expect(error.name).to.be.equal('BadRequestError');
    });

    it(`should default status to ${HttpStatus.BAD_REQUEST}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.BAD_REQUEST);
    });

    it('should default message to \'One or more parameters are invalid.\'', () => {
      expect(error.message).to.be.equal('One or more parameters are invalid.');
    });
  });

  describe('when a message is set', () => {
    let error;
    const message = 'Some message!';

    beforeEach(() => {
      error = new BadRequestError(message);
    });

    // redundant test for security
    it(`should keep status_code as ${HttpStatus.BAD_REQUEST}`, () => {
      expect(error.status_code).to.be.equal(HttpStatus.BAD_REQUEST);
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
      error = new BadRequestError(message, status_code);
    });

    it('should ignore the status code', () => {
      expect(error.status_code).to.be.equal(HttpStatus.BAD_REQUEST);
    });
  });
});
