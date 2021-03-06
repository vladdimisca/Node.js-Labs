'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasOne(models.Profile, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
      models.User.hasMany(models.Post, { foreignKey: 'userId', onDelete: 'cascade', hooks: true  });
      models.User.hasMany(models.Comment, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
      models.User.belongsToMany(models.User, {as: "Followers", foreignKey: "followerId", through: 'FollowerFollowed' });
      models.User.belongsToMany(models.User, {as: "Followeds", foreignKey: "followedId", through: 'FollowerFollowed' });
    }
  };
  User.init({
    email: { type: DataTypes.STRING,  unique: 'compositeIndex' },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};