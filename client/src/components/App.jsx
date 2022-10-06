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
  userState,
  groupIdState,
  messageState,
  recipientIdState,
  socketState,
  userIdState,
} from './userAtoms.js';
import Login from "./Login/Login.jsx";
import axios from 'axios'

let socket = undefined;

const App = () => {
  // Change if using Recoil state manager
  // Change loggedIn to false when in production
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [recipientId, setRecipientId] = useRecoilState(recipientIdState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);
  const [msgHistory, setMsgHistory] = useRecoilState(messageState);
  const [socketId, setSocketId] = useRecoilState(socketState);
  const [count, setCount] = useState(0);
  const [tokenGood, setTokenGood] = useState(false);

  useEffect(() => {
  // Once login is implemented, uncomment out if statement
  // Set temp socket id for testing multiple users interacting
  let socketIDtemp = socketId;
    if (loggedIn) {
      socket.on('welcome-back', (socketID) => {
        console.log(`Welcome back: ${socketID}`);
        socketIDtemp = socketID;
        socket.emit('store-username', [user, socketIDtemp]);
        setSocketId(socketIDtemp);
      });
      socket.emit('store-username', [user, socketIDtemp]);
      socket.on('user-id', (userId) => {
        console.log('Your user id is:', userId);
        setUserId(userId);
      });
    }

  }, [socket, user]);

const testUser1 = {
  username: 'yt',
  firstName: 'Yong',
  lastName: 'Tang',
  img: 'null',
}

const testUser2 = {
  username: 'ds',
  firstName: 'Daniel',
  lastName: 'Shin',
  img: 'null',
}

const testUser3 = {
  username: 'bv',
  firstName: 'Brian',
  lastName: 'Vose',
  img: 'null',
}

  // Remove test buttons in production
  const testButton1 = () => {
    if (user.username === 'yt') {
      setUser(testUser2);
    } else {
      setUser(testUser1);
    }
  }

  const testButton2 = () => {
    if (user.username === 'yt') {
      setUser(testUser3);
    } else {
      setUser(testUser1);
    }
  }

  const logOut = ()=>{
    axios.delete('http://ec2-3-128-156-90.us-east-2.compute.amazonaws.com:8087/logout', { data: { token: localStorage.getItem('token') } })
      .then((data) => {
        localStorage.setItem('accessToken', '');
        axios.defaults.headers.common['Authorization'] = '';
        socket.disconnect();
        setCount(0);
        setTokenGood(false);
        setLoggedIn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!loggedIn) {
    return (
      <div>
        <Login setTokenGood={setTokenGood} setCount={setCount} setLoggedIn={setLoggedIn}/>
      </div>
    );
  } else {
    if (!tokenGood) {
      setLoggedIn(false);
    }
    if (count === 1) {
      socket = io({
        auth: {
          token: localStorage.getItem('accessToken')
        }
      });
      setCount(2);
    }
    return (
      <div>
         <div style={{padding: '5px', float:'right'}}><button class='button' onClick ={logOut}>Log Out</button></div>
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
        {/* <button onClick={testButton2}>Toggle user. You are currently user ${username}</button>
        <button onClick={testButton1}>Set group to 3</button> */}
      </div>
    );
  }
}


export default App;
