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
  await client.query(`CREATE TABLE IF NOT EXISTS auth (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    createdAt timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC')
  );`)
  .then(() => console.log('Auth Table Created'))
  .catch(err => console.log('Table failed to create: ', err))

  await client.query(`CREATE TABLE IF NOT EXISTS refreshTokens (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    tokenid TEXT NOT NULL,
    createdAt timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC')
  );`)
  .then(() => console.log('refreshToken Table Created'))
  .catch(err => console.log('Table failed to create: ', err))
  client.end();
}

makeAuthTable();