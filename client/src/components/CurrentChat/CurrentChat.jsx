import React from "react";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage.jsx';

const CurrentChat = (props) => {
  //get all messages that match user id and recipient id
    //loop through messages passing them into ChatMessage
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
            <input type='text' id='current-chat-draft' placeholder='type your message'></input>
          </div>
          <div className="button" id='current-chat-send-button'>send</div>
      </div>
    )
  }

  export default CurrentChat;