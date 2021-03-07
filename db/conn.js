
const mongoose = require("mongoose");
var express = require('express');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const app = express;

mongoose.connect(process.env.DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Database Connected");
}).catch((err) => {
  console.log("unbale to connect ", err);
});

// TO CREATE TABLE IN DB FOR SESSION STORE

let mongoStore =  new MongoDbStore({
  mongooseConnection: db,
  collection: "sessions",
});

// SESSION CONFIG //required cookies to run
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    //TO STORE SESSION IN DB
      store: mongoStore,
    saveUninitialized: false,

    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 HOURS
  })
);

module.exports = db;
