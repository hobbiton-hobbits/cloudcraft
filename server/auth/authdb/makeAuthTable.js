const {Pool} = require('pg');
require('dotenv').config();


const client = new Pool({
  host: process.env.AUTHHOST,
  user: process.env.NAME,
  port: process.env.PORT,
  password: process.env.PASSWORD,
  database: process.env.AUTHDATABASE
});

client.connect((err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected to database');
});

const makeAuthTable = async () => {

  //CHANGE SCHEMA FOR AUTHENTICATION
  await client.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    firstName TEXT,
    lastName TEXT,
    token TEXT
  );`).then(() => console.log('Auth Table Created'))
  .catch(err => console.log('Table failed to create: ', err))
  client.end();
}

makeAuthTable();