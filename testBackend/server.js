const express = require('express');
const mongoose = require('mongoose');
const foodRouter = require('./routes/router');
const dotenv = require('dotenv');
const app = express();
app.use(express.json()); // Make sure it comes back as json
dotenv.config();
const cors = require('cors');


mongoose.connect(process.env.DATABASE_ACCESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology:true
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(foodRouter);
app.use(cors()) // Use this after the variable declaration
app.listen(4000, () => { console.log('Server is running...') });