'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    mime_type: DataTypes.STRING,
    url: DataTypes.STRING,
    file_size: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    length: DataTypes.INTEGER,
    newId: DataTypes.INTEGER
  }, {});
  File.associate = function(models) {
    // associations can be defined here
  };
  return File;
};