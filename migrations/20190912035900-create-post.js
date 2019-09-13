'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const create_table = queryInterface.createTable('posts',
      {
        id: {
          type:          Sequelize.INTEGER,
          allowNull:     false,
          autoIncrement: true,
          primaryKey:    true
        },
        user_id: {
          type:       Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'users'
            },
            key: 'id'
          },
          allowNull: false
        },
        title: {
          type:      Sequelize.STRING,
          allowNull: false
        },
        body: {
          type:      Sequelize.TEXT,
          allowNull: false
        },
        created_at: {
          type:      Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type:      Sequelize.DATE,
          allowNull: false
        }
      }
    );

    const add_constraint = transaction => queryInterface.addConstraint(
      'posts',
      ['user_id'],
      {
        type:       'foreign key',
        name:       'author_id_fk_constraint',
        references: {
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }
    );

    return create_table
      .then(() => add_constraint);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts');
  }
};
