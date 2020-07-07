'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pay = sequelize.define('Pay', {
    userId: DataTypes.INTEGER,
    planId: DataTypes.INTEGER,
    paidTo: DataTypes.DATE,
    realSum: DataTypes.INTEGER,
    paymentid: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
  }, {});
  Pay.associate = function (models) {
    // associations can be defined here
  };
  return Pay;
};