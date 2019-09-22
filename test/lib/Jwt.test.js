const Jwt = rfr('lib/Jwt');

const { RandomObjectBuilder } = builders;

describe('JWT', () => {
  describe('encoding data', () => {
    let data;

    beforeEach(() => {
      data = RandomObjectBuilder.random_obj();
    });

    it('should encode the data', () => {
      return Jwt.encode(data)
        .then(token => {
          expect(token).to.be.a('string');
          expect(token).to.match(/^([^.]+\.){2}[^.]+$/);
        });
    });
  });

  describe('decoding data', () => {
    let original_data;
    let encoded_data;

    beforeEach(() => {
      original_data = RandomObjectBuilder.random_obj();

      return Jwt.encode(original_data)
        .then(encoded => (encoded_data = encoded));
    });

    it('should decode the data', () => {
      return Jwt.decode(encoded_data)
        .then(data => {
          delete data.iat;

          const data_keys = Object.keys(data);
          const original_keys = Object.keys(original_data);
          const keys_match = arrays_are_equal(data_keys, original_keys);

          expect(keys_match).to.be.true;

          for (const key of data_keys) {
            if (!data[key].map) {
              expect(data[key]).to.be.equal(original_data[key]);
              continue;
            }

            expect(arrays_are_equal(data[key], original_data[key])).to.be.true;
          }
        });
    });
  });

  describe('when specifying an expiration time', () => {
    let original_data;

    beforeEach(() => {
      original_data = RandomObjectBuilder.random_obj();
    });

    it('should set expire time', () => {
      return Jwt.encode(original_data, { expiresIn: '1day' })
        .then(Jwt.decode)
        .then(data => {
          expect(data.exp).to.exist;
        });
    });
  });

  describe('when token has expired', () => {
    let original_data;
    let token;

    beforeEach(() => {
      original_data = RandomObjectBuilder.random_obj();
      original_data.iat = moment.utc().subtract(20, 'days').unix();

      return Jwt.encode(original_data, { expiresIn: '1day' })
        .then(new_token => (token = new_token));
    });

    it('should reject', done => {
      expect(Jwt.decode(token)).to.eventually.be.rejected.notify(done);
    });
  });
});
