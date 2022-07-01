const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const cors = require("cors");

const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

// Create a get api
app.get("/", (req, res) => {
  res.send("Api done");
});

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.6plls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// const uri =
//   `mongodb+srv://mongodbUser:hSMFLPo6zrAqzr8w@cluster0.6plls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

async function run() {
  try {
    await client.connect();
    const studentCollections = client.db("allStudents").collection("students");

    app.get("/students", async (req, res) => {
      const query = {};
      const cursor = studentCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Adding student Api
    app.post("/students", async (req, res) => {
      let student = req.body;
      const result = await studentCollections.insertOne(student);
      res.send({ success: true, result });
    });

    // Studetn update
    app.put("/students/:id", async (req, res) => {
      let id = req.params.id;
      console.log(req.body);
      let body = req.body;
      let query = { _id: ObjectId(id) };
      //  let email = req.params.email;
      //  let filter = { email: email };
      const updateDoc = {
        $set: body,
      };
      const result = await studentCollections.updateOne(query, updateDoc);
      res.send(result);
    });

    // REMOVE STUDENTS

    // remove single item api
    app.delete("/students/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: ObjectId(id) };
      const result = await studentCollections.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send(result);
      }
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port);
