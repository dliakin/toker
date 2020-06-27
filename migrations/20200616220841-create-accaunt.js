'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Accaunts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accauntId: {
        type: Sequelize.BIGINT
      },
      uniqueId: {
        type: Sequelize.STRING
      },
      nickName: {
        type: Sequelize.STRING
      },
      signature: {
        type: Sequelize.STRING
      },
      cover: {
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.INTEGER
      },
      active: {
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
    return queryInterface.dropTable('Accaunts');
  }
};