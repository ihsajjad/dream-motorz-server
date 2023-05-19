const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hbiibcp.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();
        const toysCollection = client.db('playSporta').collection('toys');


        
        // app.get('/products', async (req, res) => {
        //     const result = await toysCollection.find().toArray();
        //     res.send(result);
        // })

        // This method will send all data
        app.get('/products', async (req, res) => {
            const searchText = req.query.search;
            let query = {};
            if(req.query?.search){
                const regexPattern = new RegExp(`.*${searchText}.*`, 'i');
    
                query = { toyName: regexPattern };
            }
            console.log(query);

            const result = await toysCollection.find(query).toArray();
            res.send(result);
        })

        //This method will send single data
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result);
        })

        // find toys by email
        app.get('/toys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { sellerEmail: req.query.email };
            }
            
            const result = await toysCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const newToy = req.body;
            const result = await toysCollection.insertOne(newToy);
            res.send(result);
        })

        // Put method to update data
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body;

            const filter = { _id: new ObjectId(id) };

            const {availableQuantity, photo, price, toyDescription, toyName, rating} = updatedToy;

            const updateToy = {
                $set: {availableQuantity, photo, price, toyDescription, toyName, rating} 
            }

            const options = { upsert: true };
            const result = await toysCollection.updateOne(filter, updateToy, options);
            res.send(result);
        })

        // delete method
        app.delete('/products/:id', async(req, res)=> {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
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

app.get('/', (req, res) => {
    res.send('dream motorz server is running...');
})

app.listen(port, () => {
    console.log(`dream motorz server is running on port ${port}`)
})