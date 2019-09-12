const { Model } = require('sequelize');
const Bluebird  = require('bluebird');
const bcrypt    = Bluebird.promisifyAll(require('bcrypt'));

const encrypt_password = (user, options) => {
  return bcrypt.hashAsync(user.password, 10)
    .then(password_hash => (user.password = password_hash));
};

module.exports = (sequelize, DataTypes) => {
  class User extends Model { }

  User.init({
    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      allowNull:     false,
      autoIncrement: true
    },
    email: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate:  {
        isEmail:  true,
        notEmpty: true
      }
    },
    password: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate:  {
        notEmpty: true
      }
    }
  },
  {
    hooks: {
      beforeCreate: encrypt_password,
      beforeUpdate: encrypt_password
    },
    underscored: true,
    timestamps:  true,
    tableName:   'users',
    createdAt:   'created_at',
    updatedAt:   'updated_at',
    sequelize
  });

  return User;
};
