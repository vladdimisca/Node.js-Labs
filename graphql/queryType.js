const { GraphQLObjectType, GraphQLNonNull, GraphQLInt } = require('graphql');
const models = require('../models');
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
    }
  }
});

module.exports = queryType;