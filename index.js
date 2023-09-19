const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.wisjawo.mongodb.net/?retryWrites=true&w=majority`;


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

        const database = client.db('icubd')
        const icuCollection = database.collection('details');
        const doctorCollection = database.collection('doctors');


        // Get ICU 
        app.get('/icu', async (req, res) => {
            const cursor = icuCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // new ICU add
        app.post('/icu', async (req, res) => {
            const icu = req.body;
            console.log(icu)
            const result = await icuCollection.insertOne(icu)
            res.send(result)
        })


        // Get Doctors
        app.get('/doctors', async (req, res) => {
            const cursor = doctorCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // new doctor add
        app.post('/doctors', async (req, res) => {
            const doctors = req.body;
            console.log(doctors)
            const result = await doctorCollection.insertOne(doctors)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send("Server showing Successfully");
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
