'use strict';

module.exports = (sequelize, DataTypes) => {

  const UserAccaunt = sequelize.define('UserAccaunt', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    accauntId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Accaunt',
        key: 'id'
      }
    },
    goal: DataTypes.INTEGER,
  }, {});
  UserAccaunt.associate = function (models) {
    // associations can be defined here
  };
  return UserAccaunt;
};