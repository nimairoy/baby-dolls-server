const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const galleryCollection = client.db('babydollDB').collection('gallery');


        // get all the gallery image
        app.get('/galleries', async (req, res) => {
            const result = await galleryCollection.find().toArray();
            res.send(result);
        })

        // get some data
        app.get('/dolls', async (req, res) => {
            // console.log(req.query)
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
                // console.log(query)
            }
            const result = await dollsCollection.find(query).toArray();
            res.send(result);
        })


        // get data of shop by category 
        app.get('/dolls/:text', async (req, res) => {
            // console.log(req.params.text);
            if (req.params.text === 'collectible-dolls' || req.params.text === 'playing-dolls' || req.params.text === 'cute-dolls') {
                const result = await dollsCollection.find({ category: req.params.text }).toArray();
                // console.log(result)
                return res.send(result);
            }
        })

        // get all dolls
        app.get('/dolls', async (req, res) => {
            const result = await dollsCollection.find().limit(20).toArray();
            res.send(result);
        })

        //get a single doll
        app.get('/dolls/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await dollsCollection.findOne(query);
            res.send(result);
        })


        // add or insert a new doll
        app.post('/dolls', async (req, res) => {
            const doll = req.body;
            const result = await dollsCollection.insertOne(doll);
            res.send(result);
        })

        // update dolls items
        app.put('/dolls/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoll = req.body;
            // console.log(updatedDoll)
            const doll = {
                $set: {
                    doll_name: updatedDoll.doll_name,
                    photo: updatedDoll.photo,
                    price: updatedDoll.price,
                    quantity: updatedDoll.quantity,
                    description: updatedDoll.description,
                    ratings: updatedDoll.ratings,
                    category: updatedDoll.category
                }
            }
            // console.log(doll)
            const result = await dollsCollection.updateOne(filter, doll, options);
            res.send(result);
        })

        // delete 
        app.delete('/dolls/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await dollsCollection.deleteOne(query);
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