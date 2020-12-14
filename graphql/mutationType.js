const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const models = require('../models');
const userType = require('./types/userType');
const bcrypt = require('bcryptjs');
const profileType = require('./types/profileType');
const postType = require('./types/postType')
const salt = 8;

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: userType,
      args: {
        email: {
          type: GraphQLNonNull(GraphQLString),
        },
        password: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, { email, password }) => {
        password = bcrypt.hashSync(password, salt);
        return await models.User.create({ email, password });
      },
    },
    setProfile: {
        type: profileType,
        args: {
            userId: {
                type: GraphQLNonNull(GraphQLInt),
            },
            photoURL: {
                type: GraphQLString,
            },
            firstName: {
                type: GraphQLNonNull(GraphQLString),
            },
            lastName: {
                type: GraphQLNonNull(GraphQLString),
            },
        },
        resolve: async (_, { userId, photoURL, firstName, lastName }) => {
            return await models.Profile.create({ userId, photoURL, firstName, lastName });
        }
    },
    addPost: {
      type: postType,
      args: {
        userId: {
            type: GraphQLNonNull(GraphQLInt),
        },
        title: {
            type: GraphQLString,
        },
        body: {
            type: GraphQLNonNull(GraphQLString),
        },
      },
    resolve: async (_, { userId, title, body}) => {
        return await models.Post.create({ userId, title, body});
      }
    }
  },
});

module.exports = mutationType;