const {Pool} = require('pg');
require('dotenv').config();


const client = new Pool({
  host: process.env.HOST,
  user: process.env.NAME,
  port: process.env.PORT,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// CONNECT TO DATABASE
client.connect((err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected to database');
});

module.exports = client;