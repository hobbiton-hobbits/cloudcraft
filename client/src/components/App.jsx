import React from "react";
import {
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from "./UserList/UserList.jsx";
import GroupList from "./GroupList/GroupList.jsx";
import CurrentChat from "./CurrentChat/CurrentChat.jsx";
import TaskList from "./TaskList/TaskList.jsx";
import UserProfile from './UserProfile/UserProfile.jsx';
import {
  usernameState,
  groupState,
  messageState,
  recipientState,
  socketState,
} from './userAtoms.js';

const socket = io();

const App = () => {
  // Change if using Recoil state manager
  const [loggedIn, setLoggedIn] = useState(false);
  const [fullName, setFullName] = useState(null);
  const [username, setUsername] = useRecoilState(usernameState);
  const [recipient, setRecipient] = useRecoilState(recipientState);
  const [group, setGroup] = useRecoilState(groupState);
  const [msgHistory, setMsgHistory] = useRecoilState(messageState);
  const [socketId, setSocketId] = useRecoilState(socketState);

  socket.on('receive-msg', (messages) => {
    setMsgHistory([...msgHistory, ...messages]);
    console.log('Messages received:', messages);
    console.log(msgHistory);
  });

useEffect(() => {
  // Once login is implemented, uncomment out if statement
  // if (loggedIn) {
    setMsgHistory([]);
    socket.emit('join-room', {
      username,
      recipient,
      group,
    });

    socket.on('welcome-back', (socketID) => {
      // Remove in production
      console.log(`Welcome back: ${socketID}`);
      setSocketId(socketID);
    });
    // Move back store-username into welcome-back after testing is done
    socket.emit('store-username', [username, socketId]);
  //}
  }, [group, username]);


// Implement conditional rendering of login page once finished with Auth
// if (!loggedIn) {
//   return <Login/>
// }

  // Remove test buttons in production
  const testButton1 = () => {
    if (group) {
      socket.emit('leave-room', group);
      setRecipient(1);
      setGroup(null);
    } else {
      setRecipient(null);
      setGroup(3);
    }
  }

  const testButton2 = () => {
    if (username === 1) {
      setRecipient(1);
      setUsername(2);
    } else {
      setRecipient(2);
      setUsername(1);
    }
  }


  return (
      <div>
        <div id='page-title'>cloudcraft</div>
        <UserProfile />
        <div id="main-content">
          <div id="user-and-group-list">
            <UserList />
            <GroupList />
          </div>
          <CurrentChat socket={socket}/>
          <TaskList />
        </div>
        {/* Remove test buttons during production */}
        <button onClick={testButton2}>Toggle user. You are currently user ${username}</button>
        <button onClick={testButton1}>Set group to 3</button>
      </div>
  );
};

export default App;
