import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
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
const Tasks = () => {
  const [tasks, setTasks] = useState();

  useEffect(() => {
    setTasks(data.row);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newTasks = reorder(
      tasks,
      result.source.index,
      result.destination.index
    );

    setTasks([...newTasks]);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks &&
                tasks.map((task, index) => {
                  return (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          className="task-list-task"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div>{task.text}</div>
                          <div>{task.id}</div>
                          <div>{task.Due_Date}</div>
                          <button>Complete</button>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default Tasks;

// create new drag and drop context to not allow mixing for completed and not completed
// create tasks
