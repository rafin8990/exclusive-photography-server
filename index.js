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
        const reviewCollection=client.db('reviewSite').collection('reviews');
        // home page service data 
       app.get('/', async (req, res)=>{
        const query={}
        const cursor=serviceCollection.find(query);
        const services=await cursor.limit(3).toArray();
        res.send(services)
       });
    //    service page service data 
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
       });
        // id wise post reviews data

       app.post('/reviews/:id', async (req,res)=>{
        const reviews=req.body
        // console.log(user)
        const result=await reviewCollection.insertOne(reviews)
        res.send(result)
       });

    //    id wise get review data 
       app.get('/reviews/:id', async (req, res) => {
        // const id=req.query.id
        // console.log(id)
        let query = {};
        if(req.query.id){
            query={
                id: req.query.id
            }
        }
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        // console.log(reviews)
        res.send(reviews);
    });

    //  email based my review data load 

    app.get('/myreview', async (req, res)=>{
        let query={};
        if(req.query.email){
            query={
                email:req.query.email
            }
        }
        const cursor=reviewCollection.find(query);
        const allReview=await cursor.toArray()
        res.send(allReview)
    });

    // update data 
    app.get('/myreview/:id', async (req, res)=>{
        const id=req.params.id;
        const query={_id: ObjectId(id)};
        const result=await reviewCollection.findOne(query);
        res.send(result);

    })

    app.put('/myreview/:id', async(req, res)=>{
        const id = req.params.id;
        const filter={_id: ObjectId(id)}
        const data=req.body;
        console.log(data)
        const option= {upsert:true};
        const updatedUser= {
            $set: {
                name: data.name,
                review: data.review,
            }
        } 
        const result = await reviewCollection.updateOne(filter, updatedUser, option);
        res.send(result);


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