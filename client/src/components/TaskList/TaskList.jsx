import React, { useEffect, useState } from "react";
import axios from "axios";
import Tasks from "./Tasks.jsx";
import { useRecoilValue } from "recoil";
import { userIdState } from "../userAtoms.js";

const TaskList = () => {
  const [createTask, setCreateTasks] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [allTasks, setTasks] = useState([]);
  const [searchedTasks, setSearchedTasks] = useState([]);
  const userId = useRecoilValue(userIdState);
  const [taskCompleted, setTaskCompleted] = useState(false);

  useEffect(() => {
    var data = {
      params: {
        userId,
      },
    };
    if (userId) {
      axios.get("/tasks", data).then((res) => {
        setTasks(res.data);
        setSearchedTasks(res.data);
      });
      // axios request will go here for tasks
    }
  }, [userId, taskCompleted]);

  const onClickCreate = () => {
    setCreateTasks((preState) => !preState);
    if (createTask) {
      if (newTask !== "") {
        let newTaskText = newTask;

        let taskObject = {
          userId: userId,
          text: newTaskText,
          messageId: null,
        };

        axios
          .post("/tasks", taskObject)
          .then((res) => {
            setTaskCompleted((prevState) => !prevState);
            res.status(200);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }

    if (!createTask) {
      setNewTask("");
    }
  };

  const onChange = (e) => {
    setNewTask(e.target.value);
  };

  const onComplete = (e) => {
    var taskId = {
      taskId: e.target.id,
    };
    axios
      .put("/tasks", taskId)
      .then((res) => {
        setTaskCompleted((prevState) => !prevState);
        res.status(204);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSearch = (searchText) => {
    if (searchText.length > 2) {
      var filterMessages = searchedTasks.filter((task) => {
        return task.task_text.toLowerCase().includes(searchText.toLowerCase());
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
      <div id="task-list-tasks">
        <Tasks
          searchedTasks={searchedTasks}
          setSearchedTasks={setSearchedTasks}
          onComplete={onComplete}
        />
      </div>
      {createTask ? (
        <>
          <input type="text" onChange={(e) => onChange(e)} value={newTask} />
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
