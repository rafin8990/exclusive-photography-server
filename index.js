const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('reviewSite').collection('services');
       app.get('/', async (req, res)=>{
        const query={}
        const cursor=serviceCollection.find(query);
        const services=await cursor.limit(3).toArray();
        res.send(services)
       });

       app.get('/services', async (req, res)=>{
        const query={}
        const cursor=serviceCollection.find(query);
        const services=await cursor.toArray();
        res.send(services)
       });

       app.get('/services/:id', async (req, res)=>{
        const id=req.params.id 
        const query={_id: ObjectId(id)}
        const result= await serviceCollection.findOne(query)
        res.send(result)
       })
    }
    finally {

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Photography websitee server is runnning')
});

app.listen(port, () => {
    console.log(`server is running on the port: ${port}`)
});