import React from "react";
import Tasks from "./Tasks.jsx";

const TaskList = (props) => {
  const onClick = () => {
    console.log("hit");
  };
  return (
    <div id="task-list" className="widget">
      <div className="widget-title">Tasks List</div>
      <Tasks />
      <div
        className="button"
        id="task-list-create-button"
        role="button"
        onClick={onClick}
      >
        create a task
      </div>
    </div>
  );
};

export default TaskList;
