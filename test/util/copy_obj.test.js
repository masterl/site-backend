const copy_obj = rfr('util/copy_obj');

const ORIGINAL_OBJ = {
  name: 'john',
  data: {
    inner: 'test'
  }
};

describe('copy_obj', () => {
  describe('when receiving an object', () => {
    it('should return a copy of the object', () => {
      const copy = copy_obj(ORIGINAL_OBJ);

      expect(copy.name).to.be.equal(ORIGINAL_OBJ.name);
      expect(copy.data.inner).to.be.equal(ORIGINAL_OBJ.data.inner);
    });
  });

  describe('the returned object', () => {
    it('should be a copy, not a reference', () => {
      const copy = copy_obj(ORIGINAL_OBJ);

      copy.name = 'shouldn\'t change original';

      expect(ORIGINAL_OBJ.name).to.not.be.equal(copy.name);
    });
  });
});
