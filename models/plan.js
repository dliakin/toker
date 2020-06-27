'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    role: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    active: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {});
  Plan.associate = function(models) {
    // associations can be defined here
  };
  return Plan;
};