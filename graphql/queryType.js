const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList } = require('graphql');
const models = require('../models');
const postType = require('./types/postType');
const profileType = require('./types/profileType');
const userType = require('./types/userType');

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
    profile: {
        type: profileType,
        args: {
           userId: {
               type: GraphQLNonNull(GraphQLInt)
           }
        },
        resolve: async (_, { userId }) => {
            return await models.Profile.findOne({ where: { userId: userId } });
        }
    },
    getPostsByUser: {
      type: GraphQLList(postType),
      args: {
         userId: {
             type: GraphQLNonNull(GraphQLInt)
         }
      },
      resolve: async (_, { userId }) => {
        return await models.Post.findAll({ where: { userId: userId } });
      }
    },

    getPostById: {
      type: postType,
      args: {
         postId: {
             type: GraphQLNonNull(GraphQLInt)
         }
      },
      resolve: async (_, { postId }) => {
        return await models.Post.findByPk(postId);
      }
    },
  }
});

module.exports = queryType;