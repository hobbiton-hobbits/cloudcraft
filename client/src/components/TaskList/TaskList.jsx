import React from "react";

const TaskList = (props) => {
  return (
    <div id="task-list" className="widget">
      <div className="widget-title">Tasks</div>
      <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"></input>
      <div className="task-list-task">Task 1</div>
      <div className="task-list-task">Task 2</div>
      <div className="task-list-task">Task 3</div>
      <div className="task-list-task">Task 4</div>
      <div className="task-list-task">Task 5</div>
      <div className="task-list-task">Task 6</div>
      <div className="task-list-task">Task 7</div>
      <div className="task-list-task">Task 8</div>
      <div className="task-list-task">Task 9</div>
      <div className="task-list-task">Task 10</div>
      <div className="task-list-task">Task 11</div>
      <div className="task-list-task">Task 11</div>
      <div className="task-list-task">Task 11</div>
      <div className="task-list-task">Task 11</div>
      <div className="task-list-task">Task 11</div>
      <div className="task-list-task">Task 11</div>
      <div className="task-list-task">Task 11</div>
      <button className="button" id='task-list-create-button'>create a task</button>
    </div>
  );
};

export default TaskList;
