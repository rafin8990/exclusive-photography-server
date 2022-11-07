const express=require('express');
const cors=require('cors');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.get('/', (req, res)=>{
    res.send('Photography websitee server is runnning')
});

app.listen(port, ()=>{
    console.log(`server is running on the port: ${port}`)
});