import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Tasks = ({ tasks, setTasks }) => {
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
