// call dotenv, locally
//const dotenv = require('dotenv');
//dotenv.config();
//better way to call dotenv, Globally
require('dotenv/config');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// app.set('view engine, html')
app.use(express.static(__dirname +'/public'))

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());

app.disable('x-powered-by');


//Import Routes
const routes = require('./routes');

app.use('/', routes);

mongoose.connect(process.env.CONNECTIONSTRING, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
  }).then(() => {
    app.listen(4000);
    console.log('connected to DB');
  }).catch(err=>{
    console.log(`db error ${err.message}`)
});

// second argument removes the mongodb warning due to mongodb newer version
// mongodb.connect(process.env.CONNECTIONSTRING, {useUnifiedTopology: true}, async function(err, client) {
//   const db = client.db().collection("expressPrac");

//   console.log('connected');

  //create - should be in try catch block
  //await db.insertOne({ test: "this is test two", parameter: "who knows, outside maybe?"});

  //read
  // const results = await db.find().toArray();
  //const results = await db.collection("expressPrac").find({ test: "testing" }).toArray(); //narrow a search by category

  //update db.updateOne(a, b) argument a is looking up what you want to change, b is the change
  //db.updateOne({ _id: mongodb.ObjectId("60ddc12cf7fcbbaba0741f53")}, {$set: { parameter: "inside. definetly inside"}})

  //delete
  //db.deleteOne({ _id: mongodb.ObjectID("60ddc12cf7fcbbaba0741f53")});

  //to close connection after task
  //client.close();
// })