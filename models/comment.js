'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.Post, { onDelete: 'cascade', hooks: true });
      models.Comment.belongsTo(models.User, { onDelete: 'cascade', hooks: true });
    }
  };
  Comment.init({
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    body: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};