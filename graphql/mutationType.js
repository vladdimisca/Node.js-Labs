const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const models = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config/appConfig');
const jwt = require('jsonwebtoken');

// types
const userType = require('./types/userType');
const postType = require('./types/postType');

// input types
const postInputType = require('./inputTypes/postInputType');

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
      resolve: async (_, { email, password, photoURL, firstName, lastName }) => {
        password = bcrypt.hashSync(password, config.SALT);

        if (await models.User.findOne({ where: { email } })) {
          throw "User already exists!";
        }

        const user = await models.User.create({ email, password });
        await user.createProfile({ photoURL, firstName, lastName });
        return user;
      },
    },
    login: {
      type: GraphQLString,
      args: {
        email: {
          type: GraphQLNonNull(GraphQLString),
        },
        password: {
          type: GraphQLNonNull(GraphQLString),
        }
      },
      resolve: async (_, { email, password }) => {
        const user = await models.User.findOne({ where: { email } });

        if (user) {
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            // Pasam `userId` in token pentru a-l folosi la validarea tokenului (authenticationMiddleware)
            const token = jwt.sign({userId: user.id}, config.JWTSECRET);
            return token;
          }
        }
        return null;
      },
    },
    createPost: {
      type: postType,
      args: {
        postInput: {
          type: GraphQLNonNull(postInputType)
        },
      },
      resolve: async (_, { postInput }, context) => { 
        const { user } = context;
        if (!user) {
          return null;
        }

        return await user.createPost(postInput);
      }
    }
  },
});

module.exports = mutationType;