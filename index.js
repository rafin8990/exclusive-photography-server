const express = require('express');
const cors = require('cors');
const jwt=require('jsonwebtoken');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
    const authHeader=req.headers.authorization;
    if(!authHeader){
     return res.status(401).send({message: 'unauthorized access '})
    }
    const token=authHeader.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_TOKEN, function(error, decoded){
        if(error){
           return res.status(403).send({message: 'Forbidden access'})
        }
        res.decoded=decoded;
        next();
    })
    
    
}


async function run() {
    try {
        const serviceCollection = client.db('reviewSite').collection('services');
        const reviewCollection=client.db('reviewSite').collection('reviews');


        app.post('/jwt', async(req,res)=>{
            const user=req.body
            const token=jwt.sign(user,process.env.ACCESS_TOKEN, {expiresIn:'1d'})
            res.send({token})
        })

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
        const result=await reviewCollection.insertOne(reviews)
        res.send(result)
       });

    //    id wise get review data 
       app.get('/reviews/:id', async (req, res) => {
        let query = {};
        if(req.query.id){
            query={
                id: req.query.id
            }
        }
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    //  email based my review data load 

    app.get('/myreview',verifyJWT, async (req, res)=>{
     
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
        const option= {upsert:true};
        const updatedUser= {
            $set: {
                name: data.name,
                review: data.review,
            }
        } 
        const result = await reviewCollection.updateOne(filter, updatedUser, option);
        res.send(result);


    });

    // delete review 
    app.delete('/myreview/:id', async (req, res)=>{
        const id =req.params.id;
        const query={_id: ObjectId(id)};
        const result= await reviewCollection.deleteOne(query);
        res.send(result);
      });

    //   insert service 

    app.post('/reviews', async (req,res)=>{
        const service=req.body
        const result=await serviceCollection.insertOne(service)
        res.send(result)
       });

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