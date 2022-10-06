import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage.jsx';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  userState,
  groupIdState,
  messageState,
  sendMsgState,
  recipientIdState,
  userIdState,
} from '../userAtoms.js';

const CurrentChat = (props) => {
  const { socket } = props;
  const ref = useRef(null);
  const groupId = useRecoilValue(groupIdState);
  const { username } = useRecoilValue(userState);
  const userId = useRecoilValue(userIdState);
  const recipientId = useRecoilValue(recipientIdState);
  const [msgHistory, setMsgHistory] = useRecoilState(messageState);
  const [senderMsg, setSenderMsg] = useRecoilState(sendMsgState);
  const [searchQuery, setSearchQuery] = useState('');

  socket.on('receive-msg', (messages) => {
    setMsgHistory([...msgHistory, ...messages]);
    console.log('Messages received:', messages);
    console.log(msgHistory);
  });

  const handleMessage = (e) => {
    setSenderMsg(ref.current.value);
    localStorage.setItem('draft-message', ref.current.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    // console.log(ref.current.value);
    const msg = {
      userId,
      recipientId,
      groupId,
      senderMsg,
    }
    socket.emit('send-message', msg);
    localStorage.removeItem('draft-message');
    setSenderMsg('');
  };

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
  };

  const searchChat = (e) => {
    if (e.target.value.length < 3) {
      setSearchQuery('');
    } else {
      setSearchQuery(e.target.value);
    }
  };

  const filterMessages = (array) => {
    if (searchQuery !== '') {
      return array.filter((item) => {
        return item.message_text.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }
    return array;
  };

  useEffect(() => {
    const draftMsg = localStorage.getItem('draft-message');
    if (draftMsg) {
      setSenderMsg(draftMsg);
    }
  }, []);

  return (
    <div id='current-chat' className='widget'>
      <div className='widget-title'>Chat with {groupId}</div>
      <input type='text' className='current-chat-search' onChange={searchChat}/>
        <div id='current-chat-message-container'>
        {!msgHistory ? <p>Start a chat with this user</p> : filterMessages(msgHistory).map((message, key) => (
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
              send
            </div>
        </div>
    </div>
  )
  }

  export default CurrentChat;