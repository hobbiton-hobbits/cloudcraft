import React, { useEffect, useState } from "react";
import Tasks from "./Tasks.jsx";

const TaskList = (props) => {
  const [createTask, setCreateTasks] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [allTasks, setTasks] = useState();
  const [searchedTasks, setSearchedTasks] = useState();
  const [searchText, setSearch] = useState("");

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
    ],
  };

  useEffect(() => {
    setTasks(data.row);
    setSearchedTasks(data.row);
  }, []);

  const onClickCreate = () => {
    setCreateTasks((preState) => !preState);
    if (newTask !== "") {
      let newTaskText = newTask;
      let taskObject = {
        id: "10",
        text: newTaskText,
        date: new Date(),
      };
      setTasks((prevState) => [...prevState, taskObject]);
      setSearchedTasks((prevState) => [...prevState, taskObject]);
    }

    if (!createTask) {
      setNewTask("");
    }
  };

  const onChange = (e) => {
    setNewTask(e.target.value);
  };

  const onComplete = () => {
    console.log("complete");
  };

  const handleSearch = (searchText) => {
    console.log(searchText.length);
    if (searchText.length > 2) {
      var filterMessages = searchedTasks.filter((task) => {
        return task.text.toLowerCase().includes(searchText.toLowerCase());
      });
      setSearchedTasks(filterMessages);
    } else {
      setSearchedTasks(allTasks);
    }
  };

  return (
    <div id="task-list" className="widget">
      <div className="widget-title">Tasks List</div>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Tasks
        searchedTasks={searchedTasks}
        setSearchedTasks={setSearchedTasks}
        onComplete={onComplete}
      />
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
            onClick={onClickCreate}
          >
            submit task
          </div>
        </>
      ) : (
        <div
          className="button"
          id="task-list-create-button"
          role="button"
          onClick={onClickCreate}
        >
          create a task
        </div>
      )}
    </div>
  );
};

export default TaskList;
