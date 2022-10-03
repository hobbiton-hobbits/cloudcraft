import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Tasks = ({ searchedTasks, setSearchedTasks, onComplete }) => {
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newTasks = reorder(
      searchedTasks,
      result.source.index,
      result.destination.index
    );

    setSearchedTasks([...newTasks]);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {searchedTasks &&
                searchedTasks.map((task, index) => {
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
                          <input
                            id="Checkbox1"
                            type="checkbox"
                            onClick={onComplete}
                          />
                          <label>Completed</label>
                          <div>{task.text}</div>
                          <div>{task.id}</div>
                          <div>{task.Due_Date}</div>
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
