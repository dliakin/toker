'use strict';
module.exports = (sequelize, DataTypes) => {
  const TildaUser = sequelize.define('TildaUser', {
    email: DataTypes.STRING,
    paidTo: DataTypes.DATE,
  }, {});
  TildaUser.associate = function(models) {
    // associations can be defined here
  };
  return TildaUser;
};