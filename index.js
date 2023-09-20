const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.wisjawo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const database = client.db('icubd');
        const icuCollection = database.collection('details');
        const doctorCollection = database.collection('doctors');
        const medicineCollection = database.collection('medicines');
        const labCollection = database.collection('labs');

        // Middleware for admin authorization
        function isAdmin(req, res, next) {
            const userRole = req.headers['x-user-role'];
            if (userRole === 'admin') {
                next();
            } else {
                res.status(403).send('Access denied. You are not an admin.');
            }
        }

        // API endpoints accessible only to admins
        app.use('/admin', isAdmin);






        // Get ICU (Accessible to all users)
        app.get('/icu', async (req, res) => {
            const cursor = icuCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Post ICU (Admin-only access)
        app.post('/icu', async (req, res) => {
            const icu = req.body;
            const result = await icuCollection.insertOne(icu);
            res.send(result);
        });

        // Delete single icu (Admin-only access)
        app.delete('/icu/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await icuCollection.deleteOne(query);
            res.send(result);
        });

        // Get Doctors (Accessible to all users)
        app.get('/doctors', async (req, res) => {
            const cursor = doctorCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Add new doctor (Admin-only access)
        app.post('/doctors', async (req, res) => {
            const doctors = req.body;
            const result = await doctorCollection.insertOne(doctors);
            res.send(result);
        });

        //get medicine
        app.get('/medicine', async (req, res) => {
            const cursor = medicineCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //delete medicine
        app.delete('/medicine/:id', async (req, res) => {
            const id = req.params.id;
            console.log("delete id", id)
            const query = { _id: new ObjectId(id) }
            const result = await medicineCollection.deleteOne(query)
            res.send(result);
        });

        // Post medicines
        app.post('/medicine', async (req, res) => {
            const medicine = req.body;
            const result = await medicineCollection.insertOne(medicine);
            res.send(result);
        });


        // get lab Test
        app.get('/lab', async (req, res) => {
            const cursor = labCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // Post lab Test
        app.post('/lab', async (req, res) => {
            const lab = req.body;
            const result = await labCollection.insertOne(lab);
            res.send(result);
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server showing Successfully");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
