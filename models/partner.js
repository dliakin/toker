'use strict';
module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define('Partner', {
    userId: DataTypes.INTEGER,
    percent: DataTypes.INTEGER
  }, {});
  Partner.associate = function (models) {
    Partner.hasMany(models.PartnerPay, { foreignKey: 'partnerId' })
  };
  return Partner;
};