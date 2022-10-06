import React from "react";
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
                searchedTasks
                  .sort((a, b) => {
                    return a.completed - b.completed;
                  })
                  .map((task, index) => {
                    return (
                      <Draggable
                        key={task.task_id}
                        draggableId={`${task.task_id}`}
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
                              id={task.task_id}
                              type="checkbox"
                              defaultChecked={task.completed}
                              onClick={onComplete}
                            />
                            <label>Completed</label>
                            <div>{task.task_text}</div>
                            <div>
                              {new Date(task.task_created).toLocaleDateString(
                                "en-us",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
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
