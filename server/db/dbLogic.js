const { Pool, Client } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.NAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

pool
  .connect()
  .then(() => {
    console.log("Pool connected");
  })
  .catch((err) => console.log("Client error: ", err));

//pass id of sender and recipient into params when invoking
const getMessages = async (sender_id, recipient_id = null, group_id = null) => {
  //may need to add in second query to get all messages that are from recipient to sender, right now it just goes from sender to recipient
  if (recipient_id) {
    return await pool.query(
      `SELECT message_id, message_text, created, sender_id, deleted
      FROM messages
      WHERE (sender_id = $1 AND recipient_id = $2 AND deleted = false)
      OR (sender_id = $2 AND recipient_id = $1 AND deleted = false)
      ORDER BY message_id ASC;`,
      [sender_id, recipient_id]
    );
  }
  if (group_id) {
    return await pool.query(
      `SELECT message_id, message_text, created, sender_id, deleted
    FROM messages
    WHERE recipient_group_id = $1 AND deleted = false
    ORDER BY message_id ASC;`,
      [group_id]
    );
  }
  // OR WHERE sender_id = $2 AND recipient_group_id = $1 AND deleted = false
};

//updates message, pass in message id and newly edited message
const editMessage = async (message_id, newMessage) => {
  return await pool.query(
    `UPDATE messages SET message_text = $1 WHERE message_id = $2;`,
    [newMessage, message_id]
  );
};

//sets delete boolean to true, pass in message id
const deleteMessage = async (message_id) => {
  return await pool.query(
    `UPDATE messages SET deleted = true WHERE message_id = $1;`,
    [message_id]
  );
};

//add new message to db pass in sender id, message text, and either recipient id or group id numbers
const addMessage = async (
  sender_id,
  recipient_id = null,
  recipient_group_id = null,
  message_text
) => {
  return await pool.query(
    `INSERT INTO messages (sender_id, recipient_id, recipient_group_id, message_text, deleted)
    VALUES ($1, $2, $3, $4, false);`,
    [sender_id, recipient_id, recipient_group_id, message_text]
  );
};

const addUser = async (username, firstName, lastName, img) => {
  return await pool.query(
    `INSERT INTO users (username, firstName, lastName, img)
    SELECT $1, $2, $3, $4
    WHERE NOT EXISTS
    (SELECT username FROM users WHERE username = $1);`,
    [username, firstName, lastName, img]
  );
};

// add user to group if not already in it -- make additional query to check if user is already in
// const addUserToGroup = async (user_id, group_id) => {
//   return await pool.query(
//     `UPDATE groups
//     SET user_ids = array_append(user_ids, $1)
//     WHERE group_id = $2`, [user_id, group_id]
//   );
// }

// create group
const addGroup = async (ids, names) => {
  return await pool.query(
    `INSERT INTO groups(user_ids, user_names)
    values($1, $2)`,
    [ids, names]
  );
};

// get all users except self
const getUsers = async (userId) => {
  return await pool.query(
    `SELECT *
    FROM users
    WHERE id != ${userId}`
  );
};

// get all groups user is in
const getGroups = async (id) => {
  return await pool.query(
    `SELECT *
    FROM groups
    WHERE (${id} = ANY (user_ids))`
  );
};

const getSingleUser = async (username) => {
  return await pool.query(
    `SELECT *
    FROM users
    WHERE username = $1`,
    [username]
  );
};

const getTasks = async (userId) => {
  return await pool.query(
    `SELECT *
    FROM tasks
    WHERE user_id = $1`,
    [userId]
  );
};

const addTask = async (userId, text, messageId) => {
  return await pool.query(
    `INSERT INTO tasks (user_id, task_text, completed, deleted, message_id)
    VALUES ($1, $2, false, false, $3)`,
    [userId, text, messageId]
  );
};

const completeTask = async (taskId) => {
  return await pool.query(
    `UPDATE tasks
    SET completed = NOT completed
    WHERE task_id = $1`,
    [taskId]
  );
};

const reorderTasks = async (userId) => {};

const updatePhoto = async ({ img, userId }) => {
  return await pool.query(
    `UPDATE users
     SET img = $1
     WHERE id = $2`,
    [img, userId]
  );
};

module.exports = {
  getMessages,
  editMessage,
  deleteMessage,
  addMessage,
  addUser,
  addGroup,
  getUsers,
  getGroups,
  getSingleUser,
  getTasks,
  addTask,
  completeTask,
  reorderTasks,
  updatePhoto,
};
