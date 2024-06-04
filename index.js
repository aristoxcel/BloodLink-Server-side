
require ('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Pass}@cluster0.kdbwfxu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {

        const userCollection = client.db('bloodBank').collection("users");
        app.post('/user', async(req, res)=>{
            const result = await userCollection.insertOne(req.body);
            res.send(result)
        })


        //all users data taken by admin
        app.get('/users', async(req, res)=>{
          const result = await userCollection.find().toArray();
          res.send(result)
      })



        // profile data taken
        app.get('/donar', async(req, res)=>{
          const email = req.query.email;
      const query = { email: email };
          const result = await userCollection.find(query).toArray()
          res.send(result)
      })


      // await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('this is home page')
})

app.listen(port, ()=>{
  console.log(`port num is: ${port}`);
})