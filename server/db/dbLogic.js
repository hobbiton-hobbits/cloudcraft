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
  // if (recipient_id) {
  //   return await pool.query(
  //     `SELECT message_id, message_text, created, sender_id, deleted
  //     FROM messages
  //     WHERE sender_id = $1 AND recipient_id = $2 AND deleted = false
  //     OR WHERE sender_id = $2 AND recipient_id = $1 AND deleted = false
  //     ORDER BY message_id DESC;`, [sender_id, recipient_id])
  // }
  // if (group_id) {
  return await pool.query(
    `SELECT message_id, message_text, created, sender_id, deleted
    FROM messages
    WHERE recipient_group_id = $1 AND deleted = false
    ORDER BY message_id DESC;`, [group_id]
  );
}
  // }
  // OR WHERE sender_id = $2 AND recipient_group_id = $1 AND deleted = false

//updates message, pass in message id and newly edited message
const editMessage = async (message_id, newMessage) => {
  return await pool.query(`UPDATE messages SET message_text = $1 WHERE message_id = $2;`, [newMessage, message_id]);
}

//sets delete boolean to true, pass in message id
const deleteMessage = async (message_id) => {
  return await pool.query(`UPDATE messages SET deleted = true WHERE message_id = $1;`, [message_id]);
}

//add new message to db pass in sender id, message text, and either recipient id or group id numbers
const addMessage = async (sender_id, recipient_id = null, recipient_group_id = null, message_text) => {
  return await pool.query(
    `INSERT INTO messages (sender_id, recipient_id, recipient_group_id, message_text, deleted)
    VALUES ($1, $2, $3, $4, false);`, [sender_id, recipient_id, recipient_group_id, message_text]);
}

const addUser = async (username, firstName, lastName, img) => {
  return await pool.query(
    `INSERT INTO users (username, firstName, lastName, img)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id)
    DO NOTHING;`, [username, firstName, lastName, img]
  );
}

// add user to group if not already in it -- make additional query to check if user is already in
const addUserToGroup = async (user_id, group_id) => {
  return await pool.query(
    `UPDATE groups
    SET user_ids = array_append(user_ids, $1)
    WHERE group_id = $2`, [user_id, group_id]
  );
}

// create group
const addGroup = async (userId, addedUserIds) => {
  return await pool.query(
    `INSERT INTO groups
    VALUES ($1, $2)`, [userId, addedUserIds]
  );
}

const getUsers = async () => {
  return await pool.query(
    `SELECT *
    FROM users`
  )
}

const getGroups = async () => {
  return await pool.query(
    `SELECT *
    FROM groups`
  )
}

module.exports = { getMessages, editMessage, deleteMessage, addMessage, addUser, addUserToGroup, addGroup, getUsers, getGroups }