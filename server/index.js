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
  addGroup,
  getSingleUser,
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
  let userId;

  // Placeholder emitted to client to confirm connection established
  socket.emit('welcome-back', socket.id);
  console.log(`User connected: ${socket.id}`);

  // When user logs in and connects to socket, store socked it with username
  socket.on('store-username', async (userInfo) => {
    const [ user, socketID ] = userInfo;
    console.log('userInfo socketID', socketID);
    const { username, firstName, lastName, img } = user;
    // This saves username associated with socket id;
    // Add user to database if not exists
    await addUser(username, firstName, lastName, img);
    userId = await getSingleUser(username);
    userSocketIds[userId.rows[0].id] = socketID;
    // Remove console log in production
    console.log('user-id', userId.rows[0].id);
    // Send back userId to client
    io.to(socketID).emit('user-id', userId.rows[0].id);
  });

  // Executes if a user previously joined a room
  socket.on('leave-room', (group) => {
    socket.leave(group);
    currentRoom = undefined;
  });

  // Socket listener for entering a group room
  socket.on('join-room', async (group) => {
    // Remove console logs in production
    console.log(`${socket.id} has emitted join event to group:`, group);
    socket.join(group);
    // Insert db query to insert user into group list if not already part of it
    // await addUserToGroup(userId, groupId);
  });
  // socket for sending messages to other users or groups
  socket.on('send-message', (message) => {
    console.log('message sent to server:', message);
    const {
      userId,
      recipientId,
      groupId,
      senderMsg,
      ellipsis,
      deleteDraft,
    } = message;


    // Delete in production
    const emittedMessage = {
      message_text: senderMsg,
      created: '10-2-1221',
      sender_id: userId,
      deleted: false,
      ellipsis,
      deleteDraft,
    }

    if (!groupId) {
      currentRoom = userSocketIds[recipientId];
      console.log('message emitted to single user in room:', currentRoom);
      io.to(currentRoom).to(socket.id).emit('receive-msg', [emittedMessage]);
      console.log(userId);
      if (!ellipsis) {
        addMessage(userId, recipientId, null, senderMsg);
      }
    } else {
      currentRoom = groupId;
      console.log('message emitted to group in room:', currentRoom);
      io.in(currentRoom).to(socket.id).emit('receive-msg', [emittedMessage]);
      addMessage(userId, null, groupId, senderMsg);
    }
  });

  // socket for disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
    delete userSocketIds[userId];
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


// Placeholder messages
// const tempMessages = [{
  //   message_text: 'Hello 1',
  //   created: '1-2-1221',
//   sender_id: '2',
//   deleted: false
//   }, {
//   message_text: 'Hello 2',
//   created: '1-2-1221',
//   sender_id: '1',
//   deleted: false
//   }];