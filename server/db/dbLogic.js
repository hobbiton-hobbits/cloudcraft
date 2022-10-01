const { Pool, Client } = require('pg');
require('dotenv').config()

const pool = new Pool({
  user: process.env.NAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
})

pool.connect().then(() => {
  console.log('Pool connected')
}).catch(err => (console.log('Client error: ', err)))

//pass id of sender and recipient into params when invoking
const getMessages = async (sender_id, recipient_id = null, group_id = null) => {
  //may need to add in second query to get all messages that are from recipient to sender, right now it just goes from sender to recipient
  if (recipient_id) {
    return await pool.query(`SELECT message_id, message_text, created, sender_id, deleted FROM messages WHERE sender_id = $1 AND recipient_id = $2 AND deleted = false OR WHERE sender_id = $2 AND recipient_id = $1 AND deleted = false ORDER BY message_id DESC;`, [sender_id, recipient_id])
  }
  if (group_id) {
    return await pool.query(`SELECT message_id, message_text, created, sender_id, deleted FROM messages WHERE sender_id = $1 AND recipient_group_id = $2 AND deleted = false OR WHERE sender_id = $2 AND recipient_group_id = $1 AND deleted = false ORDER BY message_id DESC;`, [sender_id, group_id])
  }
}

//updates message, pass in message id and newly edited message
const editMessage = async (message_id, newMessage) => {
  return await pool.query(`UPDATE messages SET message_text = $1 WHERE message_id = $2;`, [newMessage, message_id])
}

//sets delete boolean to true, pass in message id
const deleteMessage = async (message_id) => {
  return await pool.query(`UPDATE messages SET deleted = true WHERE message_id = $1;`, [message_id])
}

//add new message to db pass in sender id, message text, and either recipient id or group id numbers
const addMessage = async (sender_id, recipient_id = null, recipient_group_id = null, message_text) => {
  return await pool.query(`INSERT INTO messages (sender_id, recipient_id, recipient_group_id, message_text, deleted) VALUES ($1, $2, $3, $4, false);`, [sender_id, recipient_id, recipient_group_id, message_text])
}




module.exports = { getMessages, editMessage, deleteMessage, addMessage }