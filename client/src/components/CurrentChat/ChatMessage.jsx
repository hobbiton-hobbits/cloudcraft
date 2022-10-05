import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { userState, recipientIdState } from '../userAtoms.js';

const ChatMessage = ({ message }) => {
  const [editModal, setEditModal] = useState(false);
  const { username } = useRecoilValue(userState);
  const allUsers = useRecoilValue(recipientIdState);
  var message = {...message}

  var img;
  var name;
  for (var i = 0; i < allUsers.length; i++) {
    if (message.sender_id === allUsers[i].id) {
      img = allUsers[i].img;
      name = allUsers[i].username;
      break;
    }
  }

  if (img === undefined) {
    img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyQ-vUcpEFSjRXQrpRorT44Xx_gZW5iB2hBg&usqp=CAU";
  }

  // console.log('From inside ChatMessage: ', message)
  if (message.deleted) {
     message.message_text = 'This message was deleted'
  }
  const editMessage = (e) => {
    e.preventDefault();
    console.log('Attempted to edit message')
    setEditModal(true);
  }
  const submitEditMessage = (e) => {
    e.preventDefault();
    //this will make an axios call to update the text when message logic to the DB is working
    message.message_text = e.target.editText.value;
    setEditModal(false);
  }
  const deleteMessage = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this message?')) {
      console.log('Attempted to delete message')
      message.message_text = 'This message was deleted'
    }
  }
  const addMessageToTask = (e) => {
    e.preventDefault();
    console.log('Attempted to add message to task')
  }
  //update this if statement when we have acess to the current users id
  if (message.sender_id === username.id) {
    return (
      <div className='current-chat-message-self-container'>
        <div className='current-chat-message-self'>
        <div>{name}</div>
        <img src={img} className='current-chat-message-self-img' />
          {editModal ?
          <form id='edit-Message-Form' onSubmit={submitEditMessage}>
            <textarea id='editText' defaultValue={message.message_text} />
            <br/>
            <input type='submit' value='Edit message'/>
          </form> : <p id='message-box'>{message.message_text}</p>}
          {message.deleted ? null :
          <>
            <button className='current-chat-edit-button' title='Edit message' onClick={editMessage}>✎</button>
            <button className='current-chat-delete-button' title='Delete message' onClick={deleteMessage}>␡</button>
            <button className='current-chat-add-task-button' title='Add task' onClick={addMessageToTask}>+</button>
          </>
          }
          <div>Posted: {message.created}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='current-chat-message-other-container' >
        <div className='current-chat-message-other'>
        <img src={img} className='current-chat-message-other-img' />
        <div>{name}</div>
          <p>{message.message_text}</p>
          {message.deleted ? null :
          <button className='current-chat-add-task-button' title='Add task' onClick={addMessageToTask}>+</button>
          }
          <div>Posted: {message.created}</div>
        </div>
      </div>
    )
  }
}


export default ChatMessage;