const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const profileInputType = new GraphQLInputObjectType({
  name: 'ProfileInput',
  fields: {
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    photoURL: { type: GraphQLString },
  }
});

module.exports = profileInputType;