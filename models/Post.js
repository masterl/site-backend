const { Model } = require('sequelize');
const rfr       = require('rfr');
const { User }  = rfr('models');
const moment    = require('moment');

const date_is_in_the_past = date => {
  const today = moment.utc();

  const diff = moment.utc(date).diff(today);

  return diff < 0;
};

const validate_data = (post, options) => {
  if (!post.changed('status')) {
    return;
  }

  if (post.status === 'published') {
    post.publish_on = moment.utc();

    return;
  }

  if (post.status !== 'scheduled') {
    post.publish_on = null;

    return;
  }

  if (!post.publish_on) {
    return Promise.reject(new Error('Publish date should be informed when scheduling a post!'));
  }

  if (date_is_in_the_past(post.publish_on)) {
    return Promise.reject(new Error('Publish date should be in the future!'));
  }
};

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static truncateCascade () {
      return this.truncate({ cascade: true });
    }
  }

  Post.init({
    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      allowNull:     false,
      autoIncrement: true
    },
    user_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: {
        model: User,
        key:   'id' // collum name on referenced model
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'hidden', 'scheduled')
    },
    publish_on: {
      type: DataTypes.DATE
    },
    title: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate:  {
        notEmpty: true
      }
    },
    body: {
      type:      DataTypes.TEXT,
      allowNull: false,
      validate:  {
        notEmpty: true
      }
    }
  },
  {
    hooks: {
      beforeSave: validate_data
    },
    underscored: true,
    timestamps:  true,
    tableName:   'posts',
    createdAt:   'created_at',
    updatedAt:   'updated_at',
    sequelize
  });

  return Post;
};
