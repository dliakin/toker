'use strict';
module.exports = (sequelize, DataTypes) => {
  const New = sequelize.define('New', {
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    active: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {});
  New.associate = function(models) {
    New.hasMany(models.File, {foreignKey: 'newId'})
  };
  return New;
};