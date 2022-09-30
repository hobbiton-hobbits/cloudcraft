import React from "react";

const CurrentChat = (props) => {
    return (
      <div id='current-chat' className='widget'>
        <div className='widget-title'>Chat with Current User</div>
          <div className='current-chat-message-other'>Chat 1</div>
          <div className='current-chat-message-self'>Chat 2</div>
          <div className='current-chat-message-other'>Chat 3</div>
          <div className='current-chat-message-self'>Chat 4</div>
          <div className='current-chat-message-other'>Chat 5</div>
          <div className='current-chat-message-other'>Chat 6</div>
          <div className='current-chat-message-other'>Chat 7</div>
          <div className='current-chat-message-other'>Chat 8</div>
          <input type='text' id='current-chat-draft' placeholder='type your message'></input>
          <div className="button">send</div>
      </div>
    )
  }

  export default CurrentChat;