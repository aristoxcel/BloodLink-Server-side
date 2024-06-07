
require ('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const recipientCollection = client.db('bloodBank').collection("recipient");


        app.post('/user', async(req, res)=>{
            const result = await userCollection.insertOne(req.body);
            res.send(result)
        })


        //all users data taken by admin
        app.get('/users', async(req, res)=>{
          const result = await userCollection.find().toArray();
          res.send(result)
      })

      app.get('/user/:email', async(req, res)=>{
        const email = req.params.email
        const query = {email}
        const result = await userCollection.findOne(query)
        res.send(result)
    })

      // user status change
      app.patch('/users/:id/status', async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        console.log(id)
        const query = { _id: new ObjectId(id) }
        console.log(query)

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        try {
            const result = await userCollection.updateOne(query
                ,
                { $set: { status: status } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User status updated successfully' });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).json({ error: 'An error occurred while updating the user status' });
        }
    });
      

    // Update user role
    app.patch('/users/:id/role', async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;

      try {
          const query = { _id: new ObjectId(id) };
          const update = { $set: { role: role } };
          const result = await userCollection.updateOne(query, update);

          if (result.modifiedCount > 0) {
              res.status(200).send({ message: 'User role updated successfully' });
          } else {
              res.status(404).send({ message: 'User not found' });
          }
      } catch (error) {
          console.error('Error updating user role:', error);
          res.status(500).send({ message: 'Internal Server Error' });
      }
  });



        // profile data taken
        app.get('/donar', async(req, res)=>{
          const email = req.query.email;
      const query = { email: email };
          const result = await userCollection.find(query).toArray()
          res.send(result)
      })


      // recipient collection post
      app.post('/donationRequest', async(req, res)=>{
        const result = await recipientCollection.insertOne(req.body);
        res.send(result)
    })


      // -------------------------------------------------


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