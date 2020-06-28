'use strict';
module.exports = (sequelize, DataTypes) => {
  const TelegramUser = sequelize.define('TelegramUser', {
    telegramId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    auth_date: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    hash: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, {});
  TelegramUser.associate = function(models) {
    // associations can be defined here
  };
  return TelegramUser;
};