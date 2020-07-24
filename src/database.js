const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

let database = null;

function getSequenceNextValue(seqName) {
  var seqDoc = db.users.findAndModify({
    query: { _id: id },
    update: { $inc: { seqValue: 1 } },
    new: true
  });

  return seqDoc.seqValue;
}
  
async function startDatabase() {
  const mongo = new MongoMemoryServer();
  const mongoDBURL = await mongo.getConnectionString();
  const connection = await MongoClient.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (!database) {
    database = connection.db();
    await database.collection("users").insertMany([
      {
        id: 1,
        name: "Obi Wan Kenobi",
        email: "ben@tattooine.com",
        password: "BlueSaber",
        token: "ABCDEF"
      },
      {
        id: 2,
        name: "Luke Skywalker",
        email: "luke@tattooine.com",
        password: "ILoveDroid5",
        token: "ABCDEFG"
      },
    ]);
    await database.collection("tweets").insertMany([
      {
        id: 1,
        userId: 1,
        text: 'Only a Sith deals in absolutes.',
        timestamp: 1595629031
      },
      {
        id: 2,
        userId: 2,
        text: 'It’s not impossible. I used to bullseye womp rats in my T-16 back home, they’re not much bigger than 2 meters.',
        timestamp: 1595629032
      },
      {
        id: 3,
        userId: 1,
        text: 'These Aren’t The Droids You’re Looking For.',
        timestamp: 1595629033
      },

    ]);
  }

  return database;
}

module.exports.startDatabase = startDatabase;
module.exports.getSequenceNextValue = getSequenceNextValue;