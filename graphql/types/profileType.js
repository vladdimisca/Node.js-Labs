const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    photoURL: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }
});

module.exports = profileType;