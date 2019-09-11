const path_to_route_base = rfr('util/path_to_route_base');

describe('path_to_route_base', () => {
  describe('for direct file names', () => {
    describe('when passed \'index.js\' as path', () => {
      it('should return \'/\'', () => {
        expect(path_to_route_base('index.js')).to.equal('/');
      });
    });

    describe('when passed \'users.js\' as path', () => {
      it('should return \'/users\'', () => {
        expect(path_to_route_base('users.js')).to.equal('/users');
      });
    });
  });

  describe('for files inside folders', () => {
    describe('when passed \'api/sheet.js\'', () => {
      it('should return \'/api/sheet\'', () => {
        expect(path_to_route_base('api/sheet.js')).to.equal('/api/sheet');
      });
    });
  });
});
