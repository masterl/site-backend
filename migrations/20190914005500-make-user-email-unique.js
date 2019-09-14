'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'users',
      ['email'],
      {
        type: 'unique',
        name: 'user_email_unique_constraint'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'users',
      'user_email_unique_constraint',
      {
        type: 'unique'
      }
    );
  }
};
