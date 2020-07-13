const path = require("path");
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const wizardRoutes = require("./routes/wizard");

const app = express();
app.use(cors());

mongoose
  .connect(
    "mongodb://" + process.env.MONGO_ATLAS_USERNAME +":" +
    process.env.MONGO_ATLAS_PW +
         "@" +
         process.env.MONGO_ATLAS_SERVER
         + "/" + process.env.MONGO_ATLAS_DATABASE,
         { useNewUrlParser: true , useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!");
    console.log(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, text/plain, application/json"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/wizard", wizardRoutes);

module.exports = app;
