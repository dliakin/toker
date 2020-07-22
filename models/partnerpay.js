'use strict';
module.exports = (sequelize, DataTypes) => {
  const PartnerPay = sequelize.define('PartnerPay', {
    partnerId: DataTypes.INTEGER,
    payId: DataTypes.INTEGER,
    paidOut: DataTypes.BOOLEAN
  }, {})
  PartnerPay.associate = function (models) {
    PartnerPay.belongsTo(models.Pay)
  }
  return PartnerPay;
}