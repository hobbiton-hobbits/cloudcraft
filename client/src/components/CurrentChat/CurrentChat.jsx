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
  const [msgHistory, setMsgHistory] = useState([]);
  const [senderMsg, setSenderMsg] = useRecoilState(sendMsgState);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useRecoilState(isTypingState);
  const [pendingMsg, setPendingMsg] = useRecoilState(pendingMsgState);

  socket.on('receive-msg', (messages) => {
    const sender = messages[0].sender_id;
    console.log('recipient id', recipientId);
    console.log('sender id', sender);
    console.log('user id', userId);
    console.log('recipient type', typeof recipientId);
    console.log('sender type', typeof sender);
    console.log('truthy sender is recipient', recipientId === sender);
    console.log('truthy sender is user', sender === userId);
    if (sender === recipientId || sender === userId) {
      if (messages[0].ellipsis === true) {
        if (pendingMsg[sender]) {
          // console.log('pending sender msg history', pendingMsg[sender]);
          if (messages[0].deleteDraft === true) {
            setPendingMsg((pendingMsg) => {
              const updatedPending = { ...pendingMsg };
              delete updatedPending[messages[0].sender_id];
              // console.log('pending updated after deleting draft', updatedPending);
              return updatedPending;
            });
          }
      } else {
        setPendingMsg((prevState) => {
          const updatedPending = { ...prevState, [messages[0].sender_id]: messages[0] };
          return updatedPending;
        });
      }
    }
    else {
      console.log('pending', pendingMsg);
      if (pendingMsg[sender]) {
        console.log('pendingMsg from sender still present:', pendingMsg[sender])
        setPendingMsg((prevState) => {
          const updatedPending = { ...prevState };
          delete updatedPending[messages[0].sender_id];
          // console.log('pending updated', updatedPending);
          return updatedPending;
        });
      }
      setMsgHistory([...msgHistory, ...messages]);
      console.log('Messages received:', messages);
    }
    // console.log('pending Messages', pendingMsg)
  }
  });

  const handleMessage = (e) => {
    setSenderMsg(ref.current.value);
    localStorage.setItem('draft-message', ref.current.value);
  }

  useEffect(() => {
    console.log('senderMsg should be updated: ', senderMsg);
    if (recipientId || groupId) {
      if (!senderMsg.length) {
        if (isTyping) {
          socket.emit('send-message', {
            userId,
            recipientId,
            groupId,
            ellipsis: true,
            deleteDraft: true,
          });
          setIsTyping(false);
        }
      } else {
        if (!isTyping) {
          setIsTyping(true);
        }
        const ellipsis = {
          userId,
          recipientId,
          groupId,
          senderMsg,
          ellipsis: true,
        }
        socket.emit('send-message', ellipsis);
      }
    }
  }, [senderMsg])

  const sendMessage = (e) => {
    const msg = {
      userId,
      recipientId,
      groupId,
      senderMsg,
      ellipsis: false,
    }
    if (senderMsg.length) {
      socket.emit('send-message', msg);
      localStorage.removeItem('draft-message');
      setSenderMsg('');
      setIsTyping(false);
    }
  };

  const handleReturn = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (senderMsg.length > 0) {
        sendMessage(senderMsg);
      }
      return;
    }
    if (e.key === 'Enter' && e.shiftKey) {
      setSenderMsg(senderMsg);
      return;
    }
  };

  const handleSend = (e) => {
    console.log('handleSend');
    if (senderMsg.length > 0) {
      sendMessage(senderMsg);
    }
  }

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
    console.log('testing if swtiching recipient id from User List component causes useEffect messages request in CurrentChat');
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

  useEffect(() => {
    const chatbox = document.getElementById('current-chat-message-container');
    chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
  }, [pendingMsg, msgHistory]);

  return (
    <div id='current-chat' className='widget'>
      <input type='text' className='widget-title search-chat' placeholder="Search Chat..." onChange={searchChat}/>
        <div id='current-chat-message-container'>
        {!msgHistory ? <p>Start a chat with this user</p> : filterMessages(msgHistory).map((message, key) => (
          <ChatMessage key={key} message={message}/>
        ))}
        {Object.keys(pendingMsg).length
          ? filterMessages(Object.values(pendingMsg)).map((pending, key) => {
            if (pending.sender_id === recipientId || pending.sender_id === userId || groupId) {
              return (
              <ChatMessage id='current-chat-ellipsis' key={key} message={pending} pend={true}/>
            )}
        }) : null
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
          <button
            className="button"
            id='current-chat-send-button'
            onClick={handleSend}>
            Send
          </button>
        </div>
    </div>
  )
}

export default CurrentChat;