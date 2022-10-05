import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { userState, recipientIdState, userIdState } from '../userAtoms.js';

const ChatMessage = ({ message }) => {
  const [editModal, setEditModal] = useState(false);
  const { username } = useRecoilValue(userState);
  const userId = useRecoilValue(userIdState);
  const allUsers = useRecoilValue(recipientIdState);
  var message = {...message}
  const [msg, setMsg] = useState({...message});

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
    img = '/assets/Craft.png';
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
    var data = {
      messageId: message.message_id,
      text: e.target.editText.value
    }
    axios.put('/messages', data)
      .then(res => {
        console.log('msg: ', msg)
        console.log('new msg: ',e.target.editText.value)
        setMsg({...msg, message_text: e.target.editText.value});
      })
    setEditModal(false);
  }
  const deleteMessage = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this message?')) {
      var data = {
        data: {
          messageId: message.message_id
        }
      }
      axios.delete('/messages', data)
        .then(res => {
          message.message_text = 'This message was deleted'
          console.log('new message: ', message.message_text);
        })
    }
  }
  const addMessageToTask = (e) => {
    e.preventDefault();
    var data = {
      userId,
      text: message.message_text,
      messageId: message.message_id
    }
    console.log('data in adding to task: ', data)
    // axios.post('/tasks', data)
    console.log('Attempted to add message to task')
  }
  //update this if statement when we have acess to the current users id
  if (message.sender_id === userId) {
    return (
      <div className='current-chat-message-self-container'>
        <div className='current-chat-message-self'>
        <div>{name}</div>
        <img src={img} className='current-chat-message-self-img' />
          {editModal ?
          <form id='edit-Message-Form' onSubmit={submitEditMessage}>
            <textarea id='editText' defaultValue={msg.message_text} />
            <br/>
            <input type='submit' value='Edit message'/>
          </form> : <p id='message-box'>{msg.message_text}</p>}
          {message.deleted ? null :
          <>
            <button className='current-chat-edit-button' title='Edit message' onClick={editMessage}>✎</button>
            <button className='current-chat-delete-button' title='Delete message' onClick={deleteMessage}>␡</button>
            <button className='current-chat-add-task-button' title='Add task' onClick={addMessageToTask}>+</button>
          </>
          }
          <div style={{fontSize: 'xx-small'}}>Posted: {message.created}</div>
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
          <div style={{fontSize: 'xx-small'}}>Posted: {message.created}</div>
        </div>
      </div>
    )
  }
}


export default ChatMessage;