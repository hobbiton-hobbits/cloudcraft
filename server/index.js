require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const app = express();
const compression = require('compression');
const db = require('./db');
const {
  getMessages,
  editMessage,
  deleteMessage,
  addMessage,
  addUser,
  addUserToGroup,
  addGroup
} = require('./db/dbLogic.js');
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
  console.log(`User connected: ${socket.id}`);

  socket.on('leave-room', (room) => {
    socket.leave(room);
  });

  // Socket listener for entering a group room
  socket.on('join-room', async (data) => {
    console.log(`${socket.id} has emitted join event`);
    console.log('data', data);
    const { username, userId, group, groupId } = data;
    const joinTime = new Date().toLocaleString();

    // Change once authentication finalized
    await addUser(username, 'Yong', 'Tang', 'Fake_Token');

    // general room message history
    // const messages = await getMessages(userId, groupId);
    const messages = await getMessages(username, null, group).rows;

    // Placeholder messages
    const tempMessages = [{
      message_text: 'Hello 1',
      created: '1-2-1221',
      sender_id: '2',
      deleted: false
      }, {
      message_text: 'Hello 2',
      created: '1-2-1221',
      sender_id: '1',
      deleted: false
      }];

    const tempMessages2 = [{
      message_text: 'Bye 1',
      created: '1-2-1221',
      sender_id: '2',
      deleted: false
      }, {
      message_text: 'Bye 1',
      created: '1-2-1221',
      sender_id: '2',
      deleted: true
      }, {
      message_text: 'Bye 2',
      created: '1-2-1221',
      sender_id: '1',
      deleted: false
    }];

    socket.join(group);

    // Insert db query to insert user into group list if not already part of it
    await addUserToGroup(userId, groupId);

    // io.in(group).emit('receive-msg', messages);
    io.in(2).emit('receive-msg', tempMessages);
    io.in(3).emit('receive-msg', tempMessages2);
  });

  // socket for sending messages to other users or groups
  socket.on('send-message', (message) => {
    console.log('message sent:', message);
    const { username, group, senderMsg } = message;
    const emittedMessage = {
      message_text: senderMsg,
      created: '1-2-1221',
      sender_id: username.toString(),
      deleted: false,
    }

    // io.to(group).emit('receive-msg', [emittedMessage])
    io.to(2).emit('receive-msg', [emittedMessage]);
    addMessage(username, null, group, senderMsg);
  });

  // socket for disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id)
  })
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
