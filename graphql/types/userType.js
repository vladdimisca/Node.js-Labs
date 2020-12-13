const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const profileType = require('./profileType');
//const models = require('../../models');

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    email: { type: GraphQLString },
    profile: { 
      type: profileType,
      resolve: async (parent, { userId }) => {
        return await parent.getProfile(); 
      }
    },
    password: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  })
});

module.exports = userType;