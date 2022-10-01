import React from "react";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from "./UserList/UserList.jsx";
import GroupList from "./GroupList/GroupList.jsx";
import CurrentChat from "./CurrentChat/CurrentChat.jsx";
import TaskList from "./TaskList/TaskList.jsx";

const socket = io();

const App = () => {
 // Change if using Recoil state manager
 const [loggedIn, setLoggedIn] = useState(false);
 const [fullName, setFullName] = useState(null);
 const [username, setUsername] = useState(null);
 const [recipient, setRecipient] = useState(null);
 const [group, setGroup] = useState('general');
 const [receivedMsg, setReceivedMsg] = useState(null);


 useEffect(() => {
   // Once login is implemented, uncomment out if statement
   // if (loggedIn) {
     socket.on('welcome-back', (socketID) => {
       // Confirm socketID connection with server
       console.log(`Welcome back: ${socketID}`);
       // Send default recipient and group
       socket.emit('join-group', {
         username,
         recipient,
         group,
       }, (response) => console.log('Joined general room'));
     });

     socket.on('receive-msg', (messages) => {
       // data may be in different data structure;
       setReceivedMsg(messages);
       console.log('Messages received:', messages);
     });
   // }
 }, [socket])

 // Implement conditional rendering of login page once finished with Auth
 // if (!loggedIn) {
 //   return <Login/>
 // }

  return (
    <div>
      <div id='page-title'>cloudcraft</div>
      <div id="main-content">
        <div id="user-and-group-list">
          <UserList />
          <GroupList />
        </div>
        <CurrentChat />
        <TaskList />
      </div>
    </div>
  );
};

export default App;
