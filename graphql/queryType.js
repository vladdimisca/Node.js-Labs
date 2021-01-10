const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList } = require('graphql');
const models = require('../models');

// types
const postType = require('./types/postType');
const userType = require('./types/userType');
const commentType = require('./types/commentType');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        userId: { 
          type: GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: async (_, { userId }) => {
        return await models.User.findByPk(userId);
      }
    },
    post: {
      type: GraphQLList(postType),
      args: {
        userId: {
          type: GraphQLInt,
        },
        postId: {
          type: GraphQLInt,
        }
      },
      resolve: async (_, { userId, postId }) => {
        if (userId) {
          const user = await models.User.findByPk(userId);
          if (!user) {
            throw "User not found!";
          } 
          if (!postId) {
            return await user.getPosts();
          }
          const posts = await user.getPosts({ where: { id: postId } });
          if (posts.length == 0) {
            throw "This post doesn't exist or doesn't belong to this user";
          }
          return posts;
        }
        const post = await models.Post.findByPk(postId);
        if (!post) {
          throw "Post id is missing or the post does not exist";
        }
        return [post];
      }
    },
    comment: {
      type: GraphQLList(commentType),
      args: {
        postId: {
          type: GraphQLInt,
        },
        commentId: {
          type: GraphQLInt,
        }
      },
      resolve: async (_, { postId, commentId }) => {
        if (postId) {
          const post = await models.Post.findByPk(postId);
          if (!post) {
            throw "Post not found!";
          } 
          if (!commentId) {
            return await post.getComments();
          }
          const comments = await post.getComments({ where: { id: commentId } });
          if (comments.length == 0) {
            throw "This comment doesn't exist or doesn't belong to this post";
          }
          return comments;
        }
        const comment = await models.Comment.findByPk(commentId);
        if (!comment) {
          throw "Comment not found";
        }
        return [comment];
      }
    }
  }
});

module.exports = queryType;