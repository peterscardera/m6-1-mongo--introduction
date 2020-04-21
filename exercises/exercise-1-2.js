const { MongoClient } = require("mongodb");

const getCollection = async (req, res) => {
  // const { dbName, collection}  =  req.params
  const dataBaseName = req.params.dbName;
  const dataBaseCollection = req.params.collection;

  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dataBaseName);

  db.collection(dataBaseCollection)
    .find()
    .toArray((err, data) => {
        console.log(data)
      if (err) {
        res.status(404).json("error");
      } else {
          res.status(200).json(data)
      }
    });
};

// create a new client
module.exports = { getCollection };
