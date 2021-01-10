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
          type: GraphQLNonNull(GraphQLInt),
        },
        postId: {
          type: GraphQLInt,
        }
      },
      resolve: async (_, { userId, postId }) => {
        if (!postId) {
          return await models.Post.findAll({ where: { userId }})
        }
        return [await models.Post.findByPk(postId)];
      }
    },
    comment: {
      type: GraphQLList(commentType),
      args: {
        postId: {
          type: GraphQLNonNull(GraphQLInt),
        },
        commentId: {
          type: GraphQLInt,
        }
      },
      resolve: async (_, { postId, commentId }) => {
        if (!commentId) {
          return await models.Comment.findAll({ where: { postId }})
        }
         
        return [await models.Comment.findByPk(commentId)];
      }
    },
    // getPostsByUser: {
    //   type: GraphQLList(postType),
    //   args: {
    //      userId: {
    //          type: GraphQLNonNull(GraphQLInt)
    //      }
    //   },
    //   resolve: async (_, { userId }) => {
    //     return await models.Post.findAll({ where: { userId } });
    //   }
    // },
    // getPostById: {
    //   type: postType,
    //   args: {
    //      postId: {
    //          type: GraphQLNonNull(GraphQLInt)
    //      }
    //   },
    //   resolve: async (_, { postId }) => {
    //     return await models.Post.findByPk(postId);
    //   }
    // },
  }
});

module.exports = queryType;