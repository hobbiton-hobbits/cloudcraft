import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { usernameState } from '../userAtoms.js';

const ChatMessage = ({ message }) => {
  const [editModal, setEditModal] = useState(false);
  const username = useRecoilValue(usernameState);

  console.log('From inside ChatMessage: ', message)
  if (message.deleted) {
     //message.message_text = 'This message was deleted'
  }
  const editMessage = (e) => {
    e.preventDefault();
    console.log('Attempted to edit message')
    setEditModal(true);
  }
  const submitEditMessage = (e) => {
    e.preventDefault();
    //this will make an axios call to update the text when message logic to the DB is working
    //message.message_text = e.target.editText.value;
    setEditModal(false);
  }
  const deleteMessage = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this message?')) {
      console.log('Attempted to delete message')
      //message.message_text = 'This message was deleted'
    }
  }
  const addMessageToTask = (e) => {
    e.preventDefault();
    console.log('Attempted to add message to task')
  }
  //update this if statement when we have acess to the current users id
  if (message.sender_id === '1') {
    return (
      <div className='current-chat-message-self-container'>
        <div className='current-chat-message-self'>
        <div>Your name: {message.sender_id}</div>
          {editModal ?
          <form id='edit-Message-Form' onSubmit={submitEditMessage}>
            <textarea id='editText'>{message.message_text}</textarea>
            <input type='submit' value='Edit message'/>
          </form> : <p>{message.message_text}</p>}
          <button className='current-chat-edit-button' onClick={editMessage}>Edit</button>
          <button className='current-chat-delete-button' onClick={deleteMessage}>Delete</button>
          <button className='current-chat-add-task-button' onClick={addMessageToTask}>Add to task</button>
          <div>Date sent/created: {message.created}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='current-chat-message-other-container' >
        <div className='current-chat-message-other'>
        <div>Name of sender: {message.sender_id}</div>
          <p>{message.message_text}</p>
          <button className='current-chat-add-task-button' onClick={addMessageToTask}>Add to task</button>
          <div>Date sent/created: {message.created}</div>
        </div>
      </div>
    )
  }
}


export default ChatMessage;