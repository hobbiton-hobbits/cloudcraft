require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const app = express();
const compression = require('compression');
const db = require('./db');
const router = require('./routes');
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

// Express middleware for cors origin and static file serving
app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.json());
app.use('/', router.users);

const io = new Server(server, {
  cors: {
    origin: `${process.env.SV_URL}`,
    methods: ['GET', 'POST'],
  },
});

// Data container for all connected users and their socket ids
const userSocketIds = {};



io.on('connection', (socket) => {
  let currentRoom;

  // Placeholder emitted to client to confirm connection established
  socket.emit('welcome-back', socket.id);
  console.log(`User connected: ${socket.id}`);

  // When user logs in and connects to socket, store socked it with username
  socket.on('store-username', (userInfo) => {
    // Implement username when Auth is finished
    // This saves username associated with socket id;
    userSocketIds[userInfo[0]] = userInfo[1];
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    currentRoom = undefined;
  });

  // Socket listener for entering a group room
  socket.on('join-room', async (data) => {
    let messages;
    // Remove console logs in production
    console.log(`${socket.id} has emitted join event`);
    console.log('data', data);

    // Need to clarify userId and data object being sent. Update when clarified with Auth side
    const { username, userId, recipient, group, groupId } = data;
    const joinTime = new Date().toLocaleString();

    // Set room as either single socket for private chats or group name if group room
    if (!group) {
      // Update query when proper data structure is determine.
      // messages = await getMessages(username, recipient, null).rows;
      // console.log('recipient only messages', messages);
    } else {
      currentRoom = group;
      socket.join(group);
      // Update query when proper data structure is determine.
      // messages = await getMessages(username, null, group).rows;
      // console.log('group messages', messages);
    }
    // Update once authentication finalized
    await addUser(username, 'Yong', 'Tang', 'Fake_Token');

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


    // Insert db query to insert user into group list if not already part of it
    await addUserToGroup(userId, groupId);

    io.to(socket.id).emit('receive-msg', tempMessages2);
  });

  // socket for sending messages to other users or groups
  socket.on('send-message', (message) => {
    console.log('message sent:', message);
    const { username, recipient, group, senderMsg } = message;
    if (!group) {
      currentRoom = userSocketIds[recipient];
    } else {
      currentRoom = group;
    }
    // Delete in production
    const emittedMessage1 = {
      message_text: senderMsg,
      created: '1-2-1221',
      sender_id: username,
      deleted: false,
    }

    const emittedMessage2 = {
      message_text: senderMsg,
      created: '10-2-1221',
      sender_id: username,
      deleted: false,
    }

    if (!group) {
      console.log('message emitted to single user in room:', currentRoom);
      io.to(currentRoom).to(socket.id).emit('receive-msg', [emittedMessage2]);
      addMessage(username, recipient, null, senderMsg);
    }
    else {
      console.log('message emitted to group in room:', currentRoom);
      io.in(currentRoom).to(socket.id).emit('receive-msg', [emittedMessage1]);
      addMessage(username, null, group, senderMsg);
    }
  });

  // socket for disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id)
  })
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
