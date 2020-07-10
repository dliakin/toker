'use strict';
module.exports = (sequelize, DataTypes) => {
  const TildaUser = sequelize.define('TildaUser', {
    email: DataTypes.STRING,
    paidTo: DataTypes.DATE,
    telegramName: DataTypes.STRING,
  }, {});
  TildaUser.associate = function (models) {
    // associations can be defined here
  };
  return TildaUser;
};