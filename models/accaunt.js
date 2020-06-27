'use strict'
module.exports = (sequelize, DataTypes) => {
  const Accaunt = sequelize.define('Accaunt', {
    accauntId: DataTypes.BIGINT,
    uniqueId: DataTypes.STRING,
    nickName: DataTypes.STRING,
    signature: DataTypes.STRING,
    cover: DataTypes.STRING,
    verified: DataTypes.INTEGER,
    active: DataTypes.INTEGER
  }, {});
  Accaunt.associate = function (models) {
    Accaunt.belongsToMany(models.User, { through: 'UserAccaunt' })
    Accaunt.hasMany(models.UserAccaunt, {as: 'accauntExtra'})
    Accaunt.hasMany(models.AccauntData)
  }
  return Accaunt
};