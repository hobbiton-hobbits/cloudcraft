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
import {
  usernameState,
  groupState,
} from './userAtoms.js';

const socket = io();

const App = () => {
  // Change if using Recoil state manager
  const [loggedIn, setLoggedIn] = useState(false);
  const [fullName, setFullName] = useState(null);
  const [username, setUsername] = useRecoilState(usernameState);
  const [group, setGroup] = useRecoilState(groupState);
  const [recipient, setRecipient] = useState(null);
  const [receivedMsg, setReceivedMsg] = useState(null);


useEffect(() => {
  // Once login is implemented, uncomment out if statement
  // if (loggedIn) {
    socket.emit('join-room', {
      username,
      recipient,
      group,
    }, (response) => console.log('Joined general room'));

    socket.on('welcome-back', (socketID) => {
      // Confirm socketID connection with server
      console.log(`Welcome back: ${socketID}`);
      // Send default recipient and group
    });

    socket.on('receive-msg', (messages) => {
      // data may be in different data structure;
      setReceivedMsg(messages);
      setGroup('Daniel');
      console.log(group);
      console.log(username);
      console.log('Messages received:', messages);
    });
  // }
 }, [socket, username, group])

// Implement conditional rendering of login page once finished with Auth
// if (!loggedIn) {
//   return <Login/>
// }
  const testButton = () => {
    setGroup('Brian');
  }

  return (
      <div>
        <div id='page-title'>cloudcraft</div>
        <div id="main-content">
          <div id="user-and-group-list">
            <UserList />
            <GroupList />
          </div>
          <CurrentChat socket={socket}/>
          <TaskList />
        </div>
        <button onClick={testButton}>Set group to Brian</button>
      </div>
  );
};

export default App;
