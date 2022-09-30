import React from "react";
import UserList from "./UserList.jsx"
import GroupList from "./GroupList.jsx"
import CurrentChat from "./CurrentChat.jsx"
import TaskList from "./TaskList.jsx"

const App = () => {
    return (
        <div>
            <h1>CloudCraft</h1>
            <div id="main-content">
                <div id="user-and-group-list">
                    <UserList />
                    <GroupList />
                </div>
                <CurrentChat />
                <TaskList />
            </div>
        </div>
    )
  }

  export default App;