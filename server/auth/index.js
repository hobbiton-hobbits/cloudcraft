require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const port = process.env.AUTHPORT;


const app = express();

//MIDDLEWARE
app.use(cors());
app.use(compression());
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
});