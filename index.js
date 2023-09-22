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

const currentDate = new Date();

// Options for formatting date
const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

// Options for formatting time
const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Set to true to use 12-hour format
};

const formattedDate = currentDate.toLocaleString('en-US', dateOptions);
const formattedTime = currentDate.toLocaleString('en-US', timeOptions);
const time = `Date: ${formattedDate} || Time: ${formattedTime}`;


async function run() {
    try {
        await client.connect();

        const database = client.db('icubd');
        const icuCollection = database.collection('details');
        const doctorCollection = database.collection('doctors');
        const medicineCollection = database.collection('medicines');
        const labCollection = database.collection('labs');
        const donarCollection = database.collection('donar');
        const ambulanceCollection = database.collection('ambulance');

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


        // -------------------------------ICU_Part-------------------------------
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
        // Update ICU
        app.get('/update/icu/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const icu = await icuCollection.findOne(query);
            res.send(icu)
        })
        app.put('/update/icu/:id', async (req, res) => {
            const id = req.params.id;
            const icu = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateICU = {
                $set: {
                    name: icu.name,
                    seat: icu.seat,
                    price: icu.price,
                    details: icu.details,
                    contact: icu.contact,
                    time: `Date: ${formattedDate} || Time: ${formattedTime}`
                }
            }
            const result = await icuCollection.updateOne(filter, UpdateICU, options)
            res.send(result)

        })
        // ----------------------------------------------------------------------------


        // ------------------------------------Doctors_Part----------------------------
        // Get Doctors 
        app.get('/doctors', async (req, res) => {
            const cursor = doctorCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // Add new doctor 
        app.post('/doctors', async (req, res) => {
            const doctors = req.body;
            const result = await doctorCollection.insertOne(doctors);
            res.send(result);
        });
        //delete doctor
        app.delete('/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await doctorCollection.deleteOne(query)
            res.send(result);
        });
        // Update doctor
        app.get('/update/doctor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const doctor = await doctorCollection.findOne(query);
            res.send(doctor)
        })
        app.put('/update/doctor/:id', async (req, res) => {
            const id = req.params.id;
            const doctor = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateDoctor = {
                $set: {
                    doctorName: doctor.doctorName,
                    designation: doctor.designation,
                    fees: doctor.fees,
                    categories: doctor.categories,
                    photo: doctor.photo,
                    details: doctor.details
                }
            }
            const result = await doctorCollection.updateOne(filter, UpdateDoctor, options)
            res.send(result)

        })

        // ----------------------------------------------------------------------------




        // -----------------------------medicine_Parts-----------------------------
        //get medicine
        app.get('/medicine', async (req, res) => {
            const cursor = medicineCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // Post medicines
        app.post('/medicine', async (req, res) => {
            const medicine = req.body;
            const result = await medicineCollection.insertOne(medicine);
            res.send(result);
        });
        //delete medicine
        app.delete('/medicine/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await medicineCollection.deleteOne(query)
            res.send(result);
        });
        // Update medicine
        app.get('/update/medicine/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const medicine = await medicineCollection.findOne(query);
            res.send(medicine)
        })
        app.put('/update/medicine/:id', async (req, res) => {
            const id = req.params.id;
            const medicine = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateMedicine = {
                $set: {
                    name: medicine.name,
                    price: medicine.price
                }
            }
            const result = await medicineCollection.updateOne(filter, UpdateMedicine, options)
            res.send(result)

        })
        // --------------------------------------------------------------------



        //-----------------------------Diagnostic Part-----------------------------
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
        // Delete lab test
        app.delete('/lab/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await labCollection.deleteOne(query)
            res.send(result);
        });
        // Update medicine
        app.get('/update/lab/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const lab = await labCollection.findOne(query);
            res.send(lab)
        })
        app.put('/update/lab/:id', async (req, res) => {
            const id = req.params.id;
            const lab = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateLab = {
                $set: {
                    name: lab.name,
                    price: lab.price
                }
            }
            const result = await labCollection.updateOne(filter, UpdateLab, options)
            res.send(result)

        })

        // -----------------------------------------------------------------------------

        // ---------------------------------BloodDonar----------------------------------
        // get donars
        app.get('/donar', async (req, res) => {
            const cursor = donarCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // post donars
        app.post('/donar', async (req, res) => {
            const donar = req.body;
            const result = await donarCollection.insertOne(donar);
            res.send(result);
        });
        // delete donar
        app.delete('/donar/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await donarCollection.deleteOne(query)
            res.send(result);
        });
        // Update Donar
        app.get('/update/blood/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const donar = await donarCollection.findOne(query);
            res.send(donar)
        })
        app.put('/update/blood/:id', async (req, res) => {
            const id = req.params.id;
            const donar = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateDonar = {
                $set: {
                    name: donar.name,
                    contact: donar.contact,
                    group: donar.group,
                    photo: donar.photo
                }
            }
            const result = await donarCollection.updateOne(filter, UpdateDonar, options)
            res.send(result)

        })


        // ----------------------------------------------------------------------

        // ------------------------------------ambolance-----------------------------
        // get ambulance
        app.get('/ambulance', async (req, res) => {
            const cursor = ambulanceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // Create Ambulance
        app.post('/ambulance', async (req, res) => {
            const ambulance = req.body;
            const result = await ambulanceCollection.insertOne(ambulance);
            res.send(result);
        });
        // delete Ambulances
        app.delete('/ambulance/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await ambulanceCollection.deleteOne(query)
            res.send(result);
        });
        // Update Ambulance
        app.get('/update/ambulance/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const ambolance = await ambulanceCollection.findOne(query);
            res.send(ambolance)
        })
        app.put('/update/ambulance/:id', async (req, res) => {
            const id = req.params.id;
            const ambulance = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateAmbulance = {
                $set: {
                    name: ambulance.name,
                    contact: ambulance.contact,
                    category: ambulance.category,
                    photo: ambulance.photo
                }
            }
            const result = await ambulanceCollection.updateOne(filter, UpdateAmbulance, options)
            res.send(result)

        })
        // ------------------------------------------------------------




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
