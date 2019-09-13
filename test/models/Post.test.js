const { User, Post } = rfr('models');
const moment         = require('moment');

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
      'status',
      'publish_on',
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

    it('should default status to \'draft\'', () => {
      delete post_info.status;

      return Post.create(post_info)
        .then(post => {
          expect(post.status).to.be.equal('draft');
        });
    });

    it('should create if status is \'draft\'', done => {
      post_info.status = 'draft';

      expect(Post.create(post_info)).to.eventually.be.fulfilled.notify(done);
    });

    it('should create if status is \'published\'', done => {
      post_info.status = 'published';

      expect(Post.create(post_info)).to.eventually.be.fulfilled.notify(done);
    });

    it('should create if status is \'hidden\'', done => {
      post_info.status = 'hidden';

      expect(Post.create(post_info)).to.eventually.be.fulfilled.notify(done);
    });

    it('shouldn\'t save publish_on if status is \'hidden\'', () => {
      post_info.status = 'hidden';
      post_info.publish_on = moment.utc().add(5, 'days');

      return Post.create(post_info)
        .then(new_post => {
          expect(new_post.publish_on).to.not.exist;
        });
    });

    it('shouldn\'t save publish_on if status is \'draft\'', () => {
      post_info.status = 'draft';
      post_info.publish_on = moment.utc().add(5, 'days');

      return Post.create(post_info)
        .then(new_post => {
          expect(new_post.publish_on).to.not.exist;
        });
    });

    it('should set publish_on if status is \'published\'', () => {
      post_info.status = 'published';
      delete post_info.publish_on;

      return Post.create(post_info)
        .then(new_post => expect(new_post.publish_on).to.exist);
    });

    it('should set publish_on to current date if status is \'published\'', () => {
      post_info.status = 'published';
      delete post_info.publish_on;

      const today = moment.utc();

      return Post.create(post_info)
        .then(new_post => {
          const diff = moment.utc(new_post.publish_on).diff(today);

          expect(diff).to.be.lt(1000);
        });
    });
  });

  describe('scheduling a post for later publishing', () => {
    let post_info;
    let user;

    beforeEach(() => {
      post_info = PostBuilder.random_post_info({ status: 'scheduled' });

      return User.truncateCascade()
        .then(() => UserBuilder.create_one())
        .then(new_user => (user = new_user))
        .then(() => (post_info.user_id = user.id));
    });

    it('should reject if publish_on isn\'t informed', done => {
      delete post_info.publish_on;

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });

    it('should reject if publish_on refers to the past', done => {
      post_info.publish_on = moment.utc().subtract(7, 'days');

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });

    it('should save valid scheduled post', done => {
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

    it('should reject if status is invalid', done => {
      post_info.status = 'chapolim';

      expect(Post.create(post_info)).to.eventually.be.rejected.notify(done);
    });
  });
});
