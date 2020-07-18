'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccauntVideo = sequelize.define('AccauntVideo', {
    videoId: DataTypes.BIGINT,
    createTime: DataTypes.DATE,
    accauntId: DataTypes.INTEGER
  }, {});
  AccauntVideo.associate = function(models) {
    // associations can be defined here
  };
  return AccauntVideo;
};