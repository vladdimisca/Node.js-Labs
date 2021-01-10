const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const commentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: { type: GraphQLInt },
    postId: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    body: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }
});

module.exports = commentType;