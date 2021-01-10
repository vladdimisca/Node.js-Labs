'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     models.Post.belongsTo(models.User, { onDelete: 'cascade', hooks: true });
     models.Post.hasMany(models.Comment, { foreignKey: 'postId', onDelete: 'cascade', hooks: true });
    }
  };
  Post.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};