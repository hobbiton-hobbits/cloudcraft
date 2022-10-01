const { Pool, Client } = require('pg');
require('dotenv').config()

const client = new Client({
  user: process.env.NAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
})

client.connect().then(() => {
  console.log('Client connected')
}).catch(err => (console.log('Client error: ', err)))

const makeTables = async () => {

  await client.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    firstName TEXT,
    lastName TEXT,
    token TEXT
  );`).then(() => console.log('Table Created'))
  .catch(err => console.log('Table failed to create: ', err))

  await client.query(`CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    user_ids INTEGER[],
    group_name TEXT
  );`)
  .then(() => console.log('Table Created'))
  .catch(err => console.log('Table failed to create: ', err))

  await client.query(`CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER,
    recipient_group_id INTEGER,
    message_text TEXT,
    created DATE DEFAULT now(),
    deleted BOOLEAN
  );`)
  .then(() => console.log('Table Created'))
  .catch(err => console.log('Table failed to create: ', err))

  await client.query(`CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    task_text TEXT,
    task_created DATE DEFAULT now(),
    completed BOOLEAN,
    deleted BOOLEAN,
    message_id INTEGER REFERENCES messages(message_id)
  );`)
  .then(() => console.log('Table Created'))
  .catch(err => console.log('Table failed to create: ', err))

  client.end();
}

makeTables();