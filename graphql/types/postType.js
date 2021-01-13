const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

// types
const userType = require('../types/userType');
const models = require('../../models');

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLInt },
    user: {
      type: userType,
      resolve: async (parent) => {
        return await models.User.findByPk(parent.userId); 
      }
    },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  })
});

module.exports = postType;