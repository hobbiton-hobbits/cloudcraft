require('dotenv').config();
const db = require('./db');
const { getMessages, editMessage, deleteMessage, addMessage } = require('./db/dbLogic.js')

const express = require('express')
const app = express()
const port = process.env.SERVERPORT;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})