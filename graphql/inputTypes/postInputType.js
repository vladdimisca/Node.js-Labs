const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const postInputType = new GraphQLInputObjectType({
  name: 'PostInput',
  fields: {
    title: { type: GraphQLNonNull(GraphQLString) },
    body: { type: GraphQLNonNull(GraphQLString) },
  }
});

module.exports = postInputType;