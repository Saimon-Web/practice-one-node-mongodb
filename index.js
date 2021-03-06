const express =require('express');
const res = require('express/lib/response');
const cors=require('cors');
const app=express();
const port =process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');

require('dotenv').config()
//Middle ware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
//mongodb connected


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5gctk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const productCollection=client.db('practice-one').collection('product');

        //api create
        app.get('/product', async(req,res) => {
            const query ={};
            const cursor=productCollection.find(query);
            const products=await cursor.toArray();
            console.log(products)
            res.send(products);

          })

          //single data id
          app.get('/product/:id',async(req,res) =>{
              const id=req.params.id;
              const query={_id:ObjectId(id)};
              const product=await productCollection.findOne(query);
              res.send(product)
          })

          //post data
          app.post('/product',async(req,res) => {
              const newProduct=req.body;
              const result=await productCollection.insertOne(newProduct);
              res.send(result)
          })

          //delete data
          app.delete('/product/:id',async(req,res) => {
              const id =req.params.id;
              const query={_id:ObjectId(id)};
              const result=await productCollection.deleteOne(query);
              res.send(result);
          })

          //update data 
          app.put('/product/:id',async(req,res) => {
              const id=req.params.id;
              const updateProduct=req.body;
              const filter={_id:ObjectId(id)};
              const options = { upsert: true };
             const updateDoc={
                $set:{
                    name:updateProduct.name,
                    description:updateProduct.description,
                    price:updateProduct.price
                }
             }
             const result=await productCollection.updateOne(filter,updateDoc,options);
             console.log(result)
          })

    }
    finally{

    }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('running node practice one')
})
app.listen(port,() => {
    console.log('data connected')
})














