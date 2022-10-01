import React from "react";
import UserList from "./UserList/UserList.jsx";
import GroupList from "./GroupList/GroupList.jsx";
import CurrentChat from "./CurrentChat/CurrentChat.jsx";
import TaskList from "./TaskList/TaskList.jsx";

const App = () => {
  return (
    <div>
      <div id='page-title'>cloudcraft</div>
      <div id="main-content">
        <div id="user-and-group-list">
          <UserList />
          <GroupList />
        </div>
        <CurrentChat />
        <TaskList />
      </div>
    </div>
  );
};

export default App;
