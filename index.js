const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();


// middleware 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Baby Dolls Server is Running');
})




const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.as9pvg2.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dollsCollection = client.db('babydollDB').collection('doll');

    // get all data 
    app.get('/alldolls', async(req, res)=>{
        const result = await dollsCollection.find().limit(20).toArray();
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('Server is Running on port', port);
})