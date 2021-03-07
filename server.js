if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const MongoDbStore = require("connect-mongo").default;
const mongoose = require("mongoose");
const passport = require("passport");

// DATA BASE
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

// SESSION CONFIG //required cookies to run
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    //TO STORE SESSION IN DB
    store: MongoDbStore.create({ mongoUrl: process.env.DB }),
    collection: "sessions",
    saveUninitialized: false,

    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 HOURS
  })
);

// passport config
// passport statergy
const passportInit = require("./config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// global middleware
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// flash
app.use(flash());

app.use(ejsLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// importing routes
const indexRoute = require("./routes/index");
app.use(indexRoute);
const composeRoute = require("./routes/compose");
app.use(composeRoute);
const blogRoute = require("./routes/blog");
app.use(blogRoute);
const homeRoute = require("./routes/home");
app.use(homeRoute);
// auth
const authentication = require("./routes/authantication");
app.use(authentication);

app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
