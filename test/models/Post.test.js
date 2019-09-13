const { User, Post } = rfr('models');

const { UserBuilder, PostBuilder } = builders;

describe('Post', () => {
  after(() => {
    return Post.truncateCascade();
  });

  describe('model', () => {
    const model_attributes = Object.keys(Post.rawAttributes);
    const required_attributes = [
      'id',
      'user_id',
      'title',
      'body',
      'created_at',
      'updated_at'
    ];

    required_attributes.map(attribute => {
      it(`should have '${attribute}' field`, () => {
        expect(model_attributes).to.include(attribute);
      });
    });
  });

  describe('creating a post with valid data', () => {
    let post_info;
    let user;

    beforeEach(() => {
      post_info = PostBuilder.random_post_info();

      return User.truncateCascade()
        .then(() => UserBuilder.create_one())
        .then(new_user => (user = new_user))
        .then(() => (post_info.user_id = user.id));
    });

    it('should create post', done => {
      expect(Post.create(post_info)).to.eventually.be.fulfilled.notify(done);
    });
  });

  describe('creating a post with invalid data', () => {
    let post_info;
    let user;

    beforeEach(() => {
      post_info = PostBuilder.random_post_info();

      return User.truncateCascade()
        .then(() => UserBuilder.create_one())
        .then(new_user => (user = new_user))
        .then(() => (post_info.user_id = user.id));
    });

    it('should reject if title is null', done => {
      delete post_info.title;

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if body is null', done => {
      delete post_info.body;

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if user_id is null', done => {
      delete post_info.user_id;

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if title is empty string', done => {
      post_info.title = '';

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if body is empty string', done => {
      post_info.body = '';

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if user_id doesn\'t belong to any user', done => {
      post_info.user_id += 1;

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });
  });
});
