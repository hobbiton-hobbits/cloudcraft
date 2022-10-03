import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage.jsx';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  usernameState,
  groupState,
  messageState,
  sendMsgState,
  recipientState,
} from '../userAtoms.js';

const CurrentChat = (props) => {
  const { socket } = props;
  const ref = useRef(null);
  const group = useRecoilValue(groupState);
  const username = useRecoilValue(usernameState);
  const recipient = useRecoilValue(recipientState);
  const [msgHistory, setMsgHistory] = useRecoilState(messageState);
  const [senderMsg, setSenderMsg] = useRecoilState(sendMsgState);

  const handleMessage = (e) => {
    setSenderMsg(ref.current.value);
    localStorage.setItem('draft-message', ref.current.value);
  }

  const sendMessage = (e) => {
    e.preventDefault();
    // console.log(ref.current.value);
    const msg = {
      username,
      recipient,
      group,
      senderMsg,
    }
    socket.emit('send-message', msg);
    localStorage.removeItem('draft-message');
    setSenderMsg('');
  }

  const handleReturn = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
      return;
    }
    if (e.key === 'Enter' && e.shiftKey) {
      setSenderMsg(senderMsg);
      return;
    }
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

  useEffect(() => {
    const draftMsg = localStorage.getItem('draft-message');
    if (draftMsg) {
      setSenderMsg(draftMsg);
    }
  }, [])

  return (
    <div id='current-chat' className='widget'>
      <div className='widget-title'>Chat with {group}</div>
      <input type='text' className='current-chat-search' onChange={searchChat}/>
        <div id='current-chat-message-container'>
        {!msgHistory ? <p>Start a chat with this user</p> : msgHistory.map((message, key) => (
          <ChatMessage key={key} message={message}/>
        ))}
        </div>
        <div id='current-chat-draft-container'>
          <textarea
            ref={ref}
            id='current-chat-draft'
            placeholder='Type your message...'
            value={senderMsg}
            onChange={handleMessage}
            onKeyDown={handleReturn}/>
          <div
            className="button"
            id='current-chat-send-button'
            onClick={sendMessage}>
            Send
          </div>
        </div>
    </div>
  )
  }

  export default CurrentChat;