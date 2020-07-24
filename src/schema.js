const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID
    name: String!
    email: String!
    password: String!
    token: String
  }

  type Tweet {
    id: ID!
    userId: Int!
    text: String!
    timestamp: Int!
  }

  type loginResponse {
    status: String!
    userId: Int
    token: String
  }

  type Query {
    tweets(userId: Int!): [Tweet!]!
    loginUser(email: String!, password: String!): loginResponse!
    users: [User!]!
  }

  type CreateUserResponse {
    status: String!
    userId: Int!
  }

  type PostTweetResponse {
    status: String!
    userId: Int!
    tweetId: Int
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): CreateUserResponse!
    postTweet(userId: Int!, text: String!): PostTweetResponse!
    editTweet(tweetId: Int!, updatedText: String!): Tweet!
  }
`);

module.exports = schema;