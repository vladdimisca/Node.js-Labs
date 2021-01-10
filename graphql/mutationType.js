const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLScalarType } = require('graphql');
const models = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config/appConfig');
const jwt = require('jsonwebtoken');

// types
const userType = require('./types/userType');
const postType = require('./types/postType');
const commentType = require('./types/commentType');

// input types
const postInputType = require('./inputTypes/postInputType');
const profileInputType = require('./inputTypes/profileInputType');

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
          type: GraphQLNonNull(GraphQLString)
        },
        profileInput: {
          type: GraphQLNonNull(profileInputType)
        },
      },
      resolve: async (_, { email, password, profileInput }) => {
        password = bcrypt.hashSync(password, config.SALT);

        if (await models.User.findOne({ where: { email } })) {
          throw "User already exists!";
        }

        const user = await models.User.create({ email, password });
        console.log(user)
        console.log(await user.createProfile(profileInput));
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
        if (!user) {
          throw "User not found";
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          // Pasam `userId` in token pentru a-l folosi la validarea tokenului (authenticationMiddleware)
          const token = jwt.sign({userId: user.id}, config.JWTSECRET);
          return token;
        }
        
        // user exists, but the password is wrong
        throw "Wrong password";
      },
    },

    updateUser: {
      type: userType,
      args: {
        email: {
          type: GraphQLNonNull(GraphQLString),
        },
        password: {
          type: GraphQLNonNull(GraphQLString)
        },
        profileInput: {
          type: GraphQLNonNull(profileInputType)
        }
      },
      resolve: async (_, { email, password, profileInput }, context) => {
        let { user } = context;
        if (!user) {
          throw "Couldn't extract the user from authorization token";
        }

        user.email = email;
        user.password = bcrypt.hashSync(password, config.SALT);
        await user.save();
        
        let profile = await user.getProfile();
        profile.photoURL = profileInput.photoURL;
        profile.firstName = profileInput.firstName;
        profile.lastName = profileInput.lastName;
        await profile.save();

        return user;
      },
    },

    deleteUser: {
      type: GraphQLString,
      args: {
      },
      resolve: async (parent, _, context) => {
        const { user } = context;
        if (!user) {
          throw "Couldn't extract the user from authorization token";
        }
        await user.destroy();
        return "User was deleted!";
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
          throw "Couldn't extract the user from authorization token";
        }
        return await user.createPost(postInput);
      }
    },

    updatePost: {
      type: postType,
      args: {
        postId: {
          type: GraphQLNonNull(GraphQLInt)
        },
        postInput: {
          type: GraphQLNonNull(postInputType)
        },
      },
      resolve: async (_, { postId, postInput }, context) => { 
        const { user } = context;
        if (!user) {
          throw "Couldn't extract the user from authorization token";
        }
        let post = await models.Post.findByPk(postId);
        if (!post) {
          throw "Post not found!";
        }
        if(!await user.hasPost(post)) {
          throw "This post belongs to another user!";
        }

        post.title = postInput.title;
        post.body = postInput.body;
        await post.save();
        return post;
      }
    },

    deletePost: {
      type: GraphQLString,
      args: {
        postId: {
          type: GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: async (_, { postId }, context) => {
        const { user } = context;
        if (!user) {
          throw "Couldn't extract the user from authorization token";
        }
        let post = await models.Post.findByPk(postId);
        await post.destroy();
        return "Post was deleted!";
      },
    },
    
    createComment: {
      type: commentType,
      args: {
        postId: { 
          type: GraphQLNonNull(GraphQLInt)
        },
        body: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, { postId, body }, context) => { 
        const { user } = context;
        if (!user) {
          throw "Couldn't extract the user from authorization token";
        }
        if (!await models.Post.findByPk(postId)) {
          throw "Post not found";
        }
        return await user.createComment({ postId, body });
      }
    },
  },
});

module.exports = mutationType;