'use strict'
module.exports = (sequelize, DataTypes) => {
  const AccauntData = sequelize.define('AccauntData', {
    accauntId: DataTypes.INTEGER,
    following: DataTypes.INTEGER,
    fans: DataTypes.INTEGER,
    heart: DataTypes.INTEGER,
    video: DataTypes.INTEGER,
    digg: DataTypes.INTEGER
  }, {});
  AccauntData.associate = function (models) {
  }
  return AccauntData;
}