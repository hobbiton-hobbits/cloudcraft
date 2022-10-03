import React, { useEffect, useState } from "react";
import Tasks from "./Tasks.jsx";

const TaskList = (props) => {
  const [createTask, setCreateTasks] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState();

  const data = {
    row: [
      {
        id: "1",
        text: "Create PR for the Task",
        Due_Date: "25-May-2021",
      },
      {
        id: "2",
        text: "Fix Styling",
        Due_Date: "26-May-2021",
      },
      {
        id: "3",
        text: "Handle Api Changes",
        Due_Date: "27-May-2021",
      },
      {
        id: "4",
        text: "Call with Backend Team",
        Due_Date: "23-Aug-2021",
      },
      {
        id: "5",
        text: "Call with Backend Team",
        Due_Date: "05-Jan-2021",
      },
      {
        id: "6",
        text: "Handle Api Changes",
        Due_Date: "27-May-2021",
      },
      {
        id: "7",
        text: "Call with Backend Team",
        Due_Date: "23-Aug-2021",
      },
      {
        id: "8",
        text: "Call with Backend Team",
        Due_Date: "05-Jan-2021",
      },
    ],
  };

  console.log("CURRENTTASK", tasks);

  useEffect(() => {
    setTasks(data.row);
  }, []);

  const onClick = () => {
    setCreateTasks((preState) => !preState);
    if (newTask !== "") {
      let newTaskText = newTask;
      let taskObject = {
        id: "10",
        text: newTaskText,
        date: new Date(),
      };
      setTasks((prevState) => [...prevState, taskObject]);
    }

    if (!createTask) {
      setNewTask("");
    }
  };

  const onChange = (e) => {
    setNewTask(e.target.value);
  };

  return (
    <div id="task-list" className="widget">
      <div className="widget-title">Tasks List</div>
      <Tasks tasks={tasks} setTasks={setTasks} />
      {createTask ? (
        <>
          {" "}
          <label>
            <input type="text" onChange={(e) => onChange(e)} value={newTask} />
          </label>
          <div
            className="button"
            id="task-list-create-button"
            role="button"
            onClick={onClick}
          >
            submit task
          </div>
        </>
      ) : (
        <div
          className="button"
          id="task-list-create-button"
          role="button"
          onClick={onClick}
        >
          create a task
        </div>
      )}
    </div>
  );
};

export default TaskList;
