const { MongoClient } = require("mongodb");
const fs = require("file-system");
const assert = require("assert");

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("exercises");
    const r = await db.collection("two").insertMany(greetings);
    assert.equal(greetings.length, r.insertedCount);
    console.log('SUCCESS')
  } catch (err) {
    console.log(err);
  }
  client.close();
};



module.exports =  { batchImport } 
