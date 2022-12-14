import React, { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import axios from "axios";
import {
  userState,
  recipientListState,
  userIdState,
  taskListUpdate,
} from "../userAtoms.js";

const ChatMessage = ({ message, pend }) => {
  const [editModal, setEditModal] = useState(false);
  const userInfo = useRecoilValue(userState);
  const userId = useRecoilValue(userIdState);
  const allUsers = useRecoilValue(recipientListState);
  const [msg, setMsg] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [date, setDate] = useState(new Date());
  const [taskCount, setTaskCount] = useRecoilState(taskListUpdate);

  var img;
  var name;
  for (var i = 0; i < allUsers.length; i++) {
    if (msg.sender_id === allUsers[i].id) {
      img = allUsers[i].img;
      name = `${allUsers[i].firstname} ${allUsers[i].lastname}`;
      break;
    }
  }

  if (img === undefined) {
    img = "/assets/Craft.png";
  }

  var userImg = userInfo.img || img;

  if (msg.deleted) {
    msg.message_text = "This message was deleted";
  }
  const editMessage = (e) => {
    e.preventDefault();
    setEditModal(true);
  };
  const submitEditMessage = (e) => {
    e.preventDefault();
    var data = {
      messageId: message.message_id,
      text: e.target.editText.value,
    };
    axios.put("/messages", data).then((res) => {
      setMsg({ ...msg, message_text: e.target.editText.value });
    });
    setEditModal(false);
  };
  const deleteMessage = (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this message?")) {
      var data = {
        data: {
          messageId: msg.message_id,
        },
      };
      axios.delete("/messages", data).then((res) => {
        setMsg({ ...msg, deleted: true });
      });
    }
  };
  const addMessageToTask = (e) => {
    e.preventDefault();
    var data = {
      userId,
      text: msg.message_text,
      messageId: msg.message_id,
    };
    console.log("data in adding to task: ", data);
    axios.post("/tasks", data).then(() => {
      setTaskCount((prev) => prev + 1);
    });
  };

  useEffect(() => {
    setMsg(message);
  }, [message]);

  //update this if statement when we have acess to the current users id
  if (msg.sender_id === userId) {
    return (
      <div
        className="current-chat-message-self-container"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div className="current-chat-message-self">
          <div className="current-chat-message-header">
            <img src={userImg} className="current-chat-message-self-img" />
            <span className="current-chat-username">{`${userInfo.firstname} ${userInfo.lastname}`}</span>
          </div>
          <div className="current-chat-date">
            Posted:{" "}
            {new Date(msg.created).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          {msg.deleted ? null : (
            <div
              className={
                showButtons
                  ? "current-chat-button-container"
                  : "current-chat-button-hide"
              }
            >
              <button
                className="current-chat-edit-button"
                title="Edit message"
                onClick={editMessage}
              >
                ???
              </button>
              <button
                className="current-chat-delete-button"
                title="Delete message"
                onClick={deleteMessage}
              >
                x
              </button>
              <button
                className="current-chat-add-task-button"
                title="Add task"
                onClick={addMessageToTask}
              >
                +
              </button>
            </div>
          )}
          {editModal ? (
            <form id="edit-Message-Form" onSubmit={submitEditMessage}>
              <textarea id="editText" defaultValue={msg.message_text} />
              <br />
              <input type="submit" value="Edit message" />
            </form>
          ) : (
            <div className="message-box">{msg.message_text}</div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="current-chat-message-other-container"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div className="current-chat-message-other">
          <div className="current-chat-message-header">
            <img src={img} className="current-chat-message-other-img" />
            <span className="current-chat-username">{name}</span>
            {pend ? <span className="typing"> &nbsp;is typing...</span> : null}
          </div>
          <div className="current-chat-date">
            Posted:{" "}
            {new Date(msg.created).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          {msg.deleted ? null : (
            <div
              className={
                showButtons
                  ? "current-chat-button-container"
                  : "current-chat-button-hide"
              }
            >
              <button
                className="current-chat-add-task-button"
                title="Add task"
                onClick={addMessageToTask}
              >
                +
              </button>
            </div>
          )}
          <div className="message-box">{msg.message_text}</div>
        </div>
      </div>
    );
  }
};

export default ChatMessage;
