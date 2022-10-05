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
  isTypingState,
  pendingMsgState,
} from '../userAtoms.js';

const CurrentChat = (props) => {
  const { socket } = props;
  const ref = useRef(null);
  const messagesEndRef = useRef(null)
  const groupId = useRecoilValue(groupIdState);
  const { username } = useRecoilValue(userState);
  const userId = useRecoilValue(userIdState);
  const recipientId = useRecoilValue(recipientIdState);
  const [msgHistory, setMsgHistory] = useRecoilState(messageState);
  const [senderMsg, setSenderMsg] = useRecoilState(sendMsgState);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useRecoilState(isTypingState);
  const [pendingMsg, setPendingMsg] = useRecoilState(pendingMsgState);

  socket.on('receive-msg', (messages) => {
    const sender = messages[0].sender_id;
    // console.log(sender);
    if (messages[0].ellipsis === true) {
      console.log('sender and recipient id:', sender === userId)
      // if (sender !== userId) {
        console.log('sender true:', sender === userId)
        setPendingMsg({...pendingMsg, [sender]: messages[0]});
      // }
    }
    else if (messages[0].deleteDraft === true) {
      setPendingMsg((pendingMsg) => {
        const updatedPending = { ...pendingMsg };
        delete updatedPending[messages[0].sender_id];
        console.log('pending updated after deleting draft', updatedPending);
        return updatedPending;
      });
    }
    else {
      console.log('pending', pendingMsg);
      if (pendingMsg[sender]) {
        console.log('pendingMsg from sender still present:', pendingMsg[sender])
        setPendingMsg((pendingMsg) => {
          const updatedPending = { ...pendingMsg };
          delete updatedPending[messages[0].sender_id];
          console.log('pending updated', updatedPending);
          return updatedPending;
        });
      }
      setMsgHistory([...msgHistory, ...messages]);
      console.log('Messages received:', messages);
      console.log(msgHistory);
    }
    console.log('pending Messages', pendingMsg)
  });

  const handleMessage = (e) => {
    if (recipientId || groupId) {
      if (!ref.current.value.length) {
        if (isTyping) {
          socket.emit('send-message', {
            userId,
            recipientId,
            groupId,
            ellipsis: false,
            deleteDraft: true,
          });
          setIsTyping(false);
        }
      } else {
        if (!isTyping) {
          setIsTyping(true);
          const ellipsis = {
            userId,
            recipientId,
            groupId,
            senderMsg: ref.current.value,
            ellipsis: true,
          }
          socket.emit('send-message', ellipsis);
        }
      }
      setSenderMsg(ref.current.value);
      localStorage.setItem('draft-message', ref.current.value);
    };
    scrollToBottom();
  }

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = {
      userId,
      recipientId,
      groupId,
      senderMsg,
      ellipsis: false,
    }
    // if (senderMsg.length) {
      socket.emit('send-message', msg);
      localStorage.removeItem('draft-message');
      setSenderMsg('');
      setIsTyping(false);
    // }
  };

  const handleReturn = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (senderMsg.length) {
        sendMessage(e);
      }
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const draftMsg = localStorage.getItem('draft-message');
    if (draftMsg) {
      setSenderMsg(draftMsg);
    }
  }, []);

  useEffect(() => {
    var data = {
      params: {
        userId,
        recipientId,
        groupId
      }
    }
    if (recipientId || groupId) {
      axios.get('/messages', data)
      .then(res => {
        console.log('messages received: ', res.data);
        setMsgHistory(res.data);
      });
    }
  }, [recipientId, groupId]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [pendingMsg, msgHistory]);

  return (
    <div id='current-chat' className='widget'>
      <div className='widget-title'>Chat with {groupId}</div>
      <input type='text' className='current-chat-search' onChange={searchChat}/>
        <div id='current-chat-message-container'>
        {!msgHistory ? <p>Start a chat with this user</p> : filterMessages(msgHistory).map((message, key) => (
          <ChatMessage key={key} message={message}/>
        ))}
        {Object.keys(pendingMsg).length
          ? filterMessages(Object.values(pendingMsg)).map((pending, key) => (
          <ChatMessage id='current-chat-ellipsis' key={key} message={pending}/>
          )) : null
        }
        <div ref={messagesEndRef} />
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