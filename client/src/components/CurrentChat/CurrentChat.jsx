import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage.jsx';

const CurrentChat = (props) => {
  const ref = useRef(null);
  //get all messages that match user id and recipient id
    //loop through messages passing them into ChatMessage
    const sendMessage = (e) => {
      e.preventDefault();
      console.log(ref.current.value);
      ref.current.value = '';
    }
    return (
      <div id='current-chat' className='widget'>
        <div className='widget-title'>Chat with Current User</div>
          <div className='current-chat-message-other-container'>
            <div className='current-chat-message-other'>Chat 1</div>
          </div>
          <div className='current-chat-message-self-container'>
            <div className='current-chat-message-self'>Chat 2</div>
          </div>
          <div className='current-chat-message-other-container'>
            <div className='current-chat-message-other'>Chat 3</div>
          </div>
          <div className='current-chat-message-self-container'>
            <div className='current-chat-message-self'>Chat 4</div>
          </div>
          <div className='current-chat-message-other-container'>
            <div className='current-chat-message-other'>Chat 5</div>
          </div>
          <div id='current-chat-draft-container'>
            <textarea ref={ref} id='current-chat-draft' placeholder='type your message'/>
            <div className="button" id='current-chat-send-button' onClick={sendMessage}>Send</div>
          </div>
      </div>
    )
  }

  export default CurrentChat;