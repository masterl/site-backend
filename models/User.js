const { Model } = require('sequelize');
const bcrypt    = require('bcrypt');

const encrypt_password = (user, options) => {
  if (!user.changed('password')) {
    return;
  }

  return bcrypt.hash(user.password, 10)
    .then(password_hash => (user.password = password_hash));
};

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static truncateCascade () {
      return this.truncate({ cascade: true });
    }

    static find_by_email (email) {
      return this.findOne({
        where: { email }
      });
    }

    check_password (plain_text_password) {
      return bcrypt.compare(plain_text_password, this.password);
    }
  }

  User.init({
    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      allowNull:     false,
      autoIncrement: true
    },
    name: {
      type:     DataTypes.STRING,
      validate: {
        notEmpty: true
      }
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
      beforeSave: encrypt_password
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
