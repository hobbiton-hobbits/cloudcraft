require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const app = express();
const compression = require('compression');
const db = require('./db');
const { getMessages, editMessage, deleteMessage, addMessage } = require('./db/dbLogic.js')
const { Server } = require('socket.io');
const port = process.env.SERVERPORT;

const server = http.createServer(app);

app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.json());

const io = new Server(server, {
cors: {
  origin: `${process.env.SV_URL}`,
  methods: ['GET', 'POST'],
},
});

io.on('connection', (socket) => {
  // Placeholder emitted to client to confirm connection established
  socket.emit('welcome-back', socket.id);
  console.log(`User connected: ${socket.id}`)

  // Socket listener for entering a group room
  socket.on('join-room', async (data) => {
    const { username, recipient, group, userId, groupId } = data;
    const joinTime = new Date().toLocaleString();

    // general room message history
    const messages = await getMessages(userId, groupId)

    // Placeholder messages
    const mockMessages = [
      { message: 'hello', username: 'user1' },
      { message: 'hello', username: 'user2' },
      { message: 'hello', username: 'user3' },
      { message: 'hello', username: 'user4' },
    ];

    socket.join(group);

    // Insert db query to insert user into group list if not already part of it
      // DB QUERY HERE

    socket.emit('receive-msg', mockMessages);
    // Default emit to notify all group members that user has entered
    socket.to(group).emit('receive-msg', {
      message: `${username} has joined the chat`,
      username: 'CHAT_BOT',
      joinTime,
    })
  });

  // socket for sending messages to other users or groups
  socket.on('send-message', (data) => {
    const { userId, group, groupId, text } = data;
    socket.to(group).emit('receive-msg', data);
    addMessage(userId, null, groupId, text);
  })

  // socket for disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id)
  })
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
