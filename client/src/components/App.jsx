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
  messageState,
} from './userAtoms.js';

const socket = io();

const App = () => {
  // Change if using Recoil state manager
  const [loggedIn, setLoggedIn] = useState(false);
  const [fullName, setFullName] = useState(null);
  const [username, setUsername] = useRecoilState(usernameState);
  const [group, setGroup] = useRecoilState(groupState);
  const [msgHistory, setMsgHistory] = useRecoilState(messageState);

  socket.on('receive-msg', (messages) => {
    setMsgHistory([...msgHistory, ...messages]);
    console.log('Messages received:', messages);
    console.log(msgHistory);
  });

useEffect(() => {
  // Once login is implemented, uncomment out if statement
  // if (loggedIn) {
    socket.emit('join-room', {
      username,
      group,
    }, (response) => console.log(`Joined ${group}!`));

    socket.on('welcome-back', (socketID) => {
      // Confirm socketID connection with server
      console.log(`Welcome back: ${socketID}`);
    });
  //}
  }, [group])


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
