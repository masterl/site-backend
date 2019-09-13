const { Model } = require('sequelize');
const rfr       = require('rfr');
const { User }  = rfr('models');

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
        key:   'id' // collum namo on referenced model
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'hidden')
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
