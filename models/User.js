const { Model } = require('sequelize');

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
    underscored: true,
    timestamps:  true,
    tableName:   'users',
    createdAt:   'created_at',
    updatedAt:   'updated_at',
    sequelize
  });

  return User;
};
