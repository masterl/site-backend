'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'posts',
      'status',
      {
        type:         Sequelize.ENUM('draft', 'published', 'hidden'),
        defaultValue: 'draft'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('posts', 'status')
      .then(() => queryInterface.sequelize.query('DROP TYPE enum_posts_status'));
  }
};
