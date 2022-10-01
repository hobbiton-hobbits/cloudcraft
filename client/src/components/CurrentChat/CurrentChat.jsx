import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage.jsx';
import { useRecoilValue } from 'recoil';
import { groupState } from '../userAtoms.js';

//Delete this once messages can be obtained from DB
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
  }, {
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
}]

const CurrentChat = (props) => {
  const { socket } = props;
  const ref = useRef(null);
  const group = useRecoilValue(groupState);
  const [messageArray, setMessageArray] = useState(tempMessages)

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(ref.current.value);
    ref.current.value = '';
  }

  const searchChat = (e) => {
    if (e.target.value.length < 3) {
      //will need way to hold original array of messages so it defaults back to that list when the user is done searching
      setMessageArray(tempMessages);
      return;
    }
    var filterMessages = messageArray.filter((item) => {
      return item.message_text.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setMessageArray(filterMessages);
  }

  return (
    <div id='current-chat' className='widget'>
      <input type='text' className='current-chat-search' onChange={searchChat}/>
      <div className='widget-title'>Chat with {group}</div>
        <div className='current-chat-message-container'>
        {messageArray.length === 0 ? <p>Start a chat with this user</p> : messageArray.map((message, key) => (
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