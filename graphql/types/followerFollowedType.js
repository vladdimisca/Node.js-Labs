const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const followerFollowedType = new GraphQLObjectType({
  name: 'FollowerFollowed',
  fields: {
    followerId: { type: GraphQLInt },
    followedId: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }
});

module.exports = followerFollowedType;