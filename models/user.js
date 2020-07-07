'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    tel: DataTypes.STRING,
    utm: DataTypes.STRING,
    telegramName: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    defaultAccauntId: DataTypes.INTEGER,
    refs_count: DataTypes.INTEGER,
  }, {});
  User.associate = function (models) {
    User.belongsToMany(models.Accaunt, { through: 'UserAccaunt' })
    User.hasMany(models.Pay, { foreignKey: 'userId' })
    User.hasOne(models.TelegramUser, { foreignKey: 'userId' })
  }
  return User
};