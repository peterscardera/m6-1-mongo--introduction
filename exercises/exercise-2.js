const { MongoClient } = require("mongodb");
const assert = require("assert");

const createGreeting = async (req, res) => {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("exercises");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body });
  }

  console.log(req.body);
  res.status(200).json("ok");
};

const getGreeting = async (req, res) => {
  const { _id } = req.params;

  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db("exercises");
  //have to upper case it as the datas value is in uppercase
  db.collection("two").findOne({ _id: _id.toUpperCase() }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db("exercises");

  const firstPart = parseInt(req.query.start) || 0;
  const sencondPart = parseInt(req.query.limit) || 5;
  const endNumber = firstPart + sencondPart;

  db.collection("two")
    .find()
    .toArray((err, result) => {
      // // const onlyTen = result.slice(0,10);
      // const firstPart = parseInt(req.query.start) >= 0  ? parseInt(req.query.start) : 0;
      // console.log(firstPart);
      // const sencondPart = parseInt(req.query.limit) >= 0 ? parseInt(req.query.limit) : 0;
      // console.log(sencondPart);
      // const endNumber = firstPart + sencondPart;
      // console.log(endNumber);

      if (result.length && firstPart <= result.length) {
        if (endNumber <= result.length) {
          const dataOnDemand = result.slice(firstPart, endNumber);
          res.status(200).json({ status: 200, dataOnDemand });
        } else if (endNumber > result.length) {
          const dataOnDemand = result.slice(firstPart, result.length);
          res.status(200).json({ status: 200, dataOnDemand });
        }
     } else if(firstPart === endNumber ){ 
        console.log('theyre equal')
      }
      else {
        res.status(400).json({ status: 400, err });
      }
    });
};

const deleteGreeting = async (req, res) => {
  const { _id } = req.params;
  // console.log(_id)
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("exercises");

    const r = await db.collection("two").deleteOne({ _id });
    assert.equal(1, r.deletedCount);
    res.status(204).json({ status: 204, _id });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  const { _id } = req.params;
  const { hello: hello } = req.body;
  console.log(hello)

  if (!hello) {
    res.status(400).json({
      status: 400,
      data: req.body,
      message: "we could only modify hello",
    });
    return;
  }

  try {
    await client.connect();
    const db = client.db("exercises");

    const query = { _id };
    console.log(query, "THIS IS QUERy")
    const newValues = { $set: { ...req.body } };

    console.log(newValues)
    console.log(query)
    const r = await db.collection("two").updateOne(query, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res.status(200).json({ status: 200, _id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, data: req.body });
  }

  // res.status(200).json({ status: 200, _id, ...req.body });
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
