import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatMessage = () => {
  return (
    <div className='current-chat-message-self'>
      <div>Your name</div>
      <div>
        <p>Text of message</p>
        <button>Edit</button>
        <button>Delete</button>
        <button>Add to task</button>
      </div>
      <div>Date sent/created</div>
    </div>
  )
  return (
    <div className='current-chat-message-other' >
      <div>Name of sender</div>
      <div>
        <p>Text of message</p>
        <button>Add to task</button>
      </div>
      <div>Date sent/created</div>
    </div>
  )
}


export default ChatMessage;