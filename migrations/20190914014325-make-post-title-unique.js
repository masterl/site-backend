'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'posts',
      ['title'],
      {
        type: 'unique',
        name: 'post_title_unique_constraint'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'posts',
      'post_title_unique_constraint',
      {
        type: 'unique'
      }
    );
  }
};
