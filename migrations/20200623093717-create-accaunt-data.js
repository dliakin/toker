'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AccauntData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accauntId: {
        type: Sequelize.INTEGER
      },
      following: {
        type: Sequelize.INTEGER
      },
      fans: {
        type: Sequelize.INTEGER
      },
      heart: {
        type: Sequelize.INTEGER
      },
      video: {
        type: Sequelize.INTEGER
      },
      digg: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AccauntData');
  }
};