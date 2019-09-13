'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('posts', 'status')
      .then(() => queryInterface.sequelize.query('DROP TYPE enum_posts_status'))
      .then(() => queryInterface.addColumn(
        'posts',
        'status',
        {
          type:         Sequelize.ENUM('draft', 'published', 'hidden', 'scheduled'),
          defaultValue: 'draft'
        })
      )
      .then(() => queryInterface.addColumn(
        'posts',
        'publish_on',
        {
          type:         Sequelize.DATE
        })
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('posts', 'status')
      .then(() => queryInterface.removeColumn('posts', 'publish_on'))
      .then(() => queryInterface.sequelize.query('DROP TYPE enum_posts_status'))
      .then(() => queryInterface.addColumn(
        'posts',
        'status',
        {
          type:         Sequelize.ENUM('draft', 'published', 'hidden'),
          defaultValue: 'draft'
        })
      );
  }
};
