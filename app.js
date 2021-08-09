// call dotenv, locally
//const dotenv = require('dotenv');
//dotenv.config();
//better way to call dotenv, Globally
require('dotenv/config');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// app.set('view engine, html')
app.use(express.static(__dirname +'/public'))
app.use(cookieParser());
mongoose.connect(process.env.CONNECTIONSTRING, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  }).then(() => {
    console.log('DB Connected');
  }).catch(err=>{
    return
});
const db = mongoose.connection;
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
}))
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

app.listen(4000);