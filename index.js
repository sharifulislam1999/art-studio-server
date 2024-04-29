const { MongoClient, ObjectId } = require('mongodb');
const express = require("express");
const app = express();
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;
app.use(cors({
  origin:["http://localhost:5173","https://b910-f0f4b.firebaseapp.com"]
}));
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guoefzb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('b9a10');
    const collection = database.collection("craftlist");
    const categoryCollection = database.collection("category");
    app.get("/",(req,res)=>{
        res.send("server running")
    });
    app.get("/items",async(req,res)=>{
        const cursor = collection.find();
        const items = await cursor.toArray();
        res.send(items);
    });
    app.get("/category",async(req,res)=>{
      const cursor = categoryCollection.find();
      const items = await cursor.toArray();
      res.send(items)
    })
    app.get("/category/:name",async(req,res)=>{
      const name = req.params.name;
      const query = {category:name};
      const items = collection.find(query);
      const result = await items.toArray();
      res.send(result)
    })
    app.get("/items/:useremail",async(req,res)=>{
        const useremail = req.params.useremail;
        const query = {useremail:useremail};
        const items = collection.find(query);
        const result = await items.toArray();
        res.send(result);
    })
    app.get("/details/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)};
        const result = await collection.findOne(query);
        res.send(result);
    })
    app.put("/update/:id",async(req,res)=>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const craft = req.body;
        const updatedCraft = {
          $set:{
            itemName: craft.itemName,
            category: craft.category,
            price: craft.price,
            rating: craft.rating,
            customizeable: craft.customizeable,
            time: craft.time,
            photo: craft.photo,
            description: craft.description,
            stock: craft.stock
          }
        }
        const result = await collection.updateOne(filter,updatedCraft)
        res.send(result);
    })
    app.delete("/delete/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)};
        const result = await collection.deleteOne(query);
        res.send(result);
    })
    app.get("/update/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)};
        const result = await collection.findOne(query);
        res.send(result);
    })
    app.post('/additem',async(req,res)=>{
        const data = req.body;
        const result = await collection.insertOne(data);
        res.send(result)   
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`server runnig on port ${port}`)
})