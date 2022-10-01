import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage.jsx';
import { useRecoilValue, useRecoilState } from 'recoil';
import { groupState, messageState } from '../userAtoms.js';

const CurrentChat = (props) => {
  const { socket } = props;
  const ref = useRef(null);
  const group = useRecoilValue(groupState);
  const [msgHistory, setMsgHistory] = useRecoilState(messageState);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(ref.current.value);
    ref.current.value = '';
  }

  const searchChat = (e) => {
    if (e.target.value.length < 3) {
      //will need way to hold original array of messages so it defaults back to that list when the user is done searching
      setMsgHistory([]);
      return;
    }
    var filterMessages = msgHistory.filter((item) => {
      return item.message_text.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setMsgHistory(filterMessages);
  }

  return (
    <div id='current-chat' className='widget'>
      <input type='text' className='current-chat-search' onChange={searchChat}/>
      <div className='widget-title'>Chat with {group}</div>
        <div id='current-chat-message-container'>
        {!msgHistory ? <p>Start a chat with this user</p> : msgHistory.map((message, key) => (
          <ChatMessage key={key} message={message}/>
        ))}
        </div>
        <div id='current-chat-draft-container'>
          <textarea ref={ref} id='current-chat-draft' placeholder='type your message'/>
          <div className="button" id='current-chat-send-button' onClick={sendMessage}>Send</div>
        </div>
    </div>
  )
  }

  export default CurrentChat;