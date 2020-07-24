const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require('./schema');
const database = require('./database');
const expressPlayground = require('graphql-playground-middleware-express').default;
const auth = require('./service/auth');


const context = async req => {
  const db = await database.startDatabase();
  const { authorization: token } = req.headers;

  return { db, token };
};

const resolvers = {
  users: async (_, context) => {
    const { db } = await context();
    return db
      .collection('users')
      .find()
      .toArray();
  },

  tweets: async ({ userId }, context) => {
    const { db } = await context();
    return db.collection('tweets')
      .find({ userId })
      .toArray();
  },

  editTweet: async ({ tweetId, updatedText }, context) => {
    const { db, token } = await context();
    const { error } = await auth.isTokenValid(token);

    if (error) {
      throw new Error(error);
    }
 
    return db
      .collection('tweets')
      .findOneAndUpdate(
        { id: tweetId },
        { $set: { text: updatedText } },
        { returnOriginal: false },
      )
      .then(resp => resp.value);
  },

  postTweet: async ({ userId, text}, context) => {
    const { db, token } = await context();
    const { error } = await auth.isTokenValid(token);

    if (error) {
      throw new Error(error);
    }
    const currentTime = Math.round(Date.now()/1000);;

    const result = await db
    .collection('tweets')
    .find()
    .toArray();
  
    const parsedIds = result.map(r => r.id);
    const maxId = Math.max(...parsedIds);

    const dbInsert = db
    .collection('tweets')
    .insertOne(
      { id: maxId + 1, userId, text, timestamp: currentTime }
    ).then(resp => resp.ops[0].id)
    const insertedRecordId = await dbInsert;
    return {status: 'Success', userId, tweetId:insertedRecordId };
  },

  createUser: async ({ id, name, email, password }, context) => {
    const jwtToken = await auth.generateToken();
    
    const { db } = await context();
    const result = await db
      .collection('users')
      .find()
      .toArray();
    
    const parsedIds = result.map(r => r.id);
    const maxId = Math.max(...parsedIds);

    const dbInsert = db
    .collection('users')
    .insertOne(
      { id: maxId + 1, name, email, password, token: jwtToken }
      )
    const insertedRecordResponse = await dbInsert;
    const insertedRecordId = insertedRecordResponse.ops[0].id;

    return { status: `Successfully created user for email ${email}`,
            userId: insertedRecordId }
  },

  loginUser: async ({ email, password }, context) => {
    const { db } = await context();
    const dbFetch = db
    .collection('users')
    .findOne({ email, password});
    
    const userRecord = await dbFetch;

    if (userRecord.token) {
      return { status: 'Login Succeeded', userId: userRecord.id, token: userRecord.token }
    } else {
      return { status: 'Login Failed' }
    }
  },
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP(async (req) => ({
    schema,
    rootValue: resolvers,
    context: () => context(req)
  })),
);
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
app.listen(4000);

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
