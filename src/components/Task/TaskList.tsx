import React, { useState } from "react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import {
  Task,
  addTask,
  moveTask,
  reorderTasks,
} from "@/store/slices/tasksSlice";
import { TaskItem } from "./TaskItem";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/store";

const TaskListContainer = styled.div<{ isSelected: boolean }>`
  margin-top: 0.5rem;
  position: absolute;
  top: 25px;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 0 4px;
  scrollbar-width: thin;
  scrollbar-color: #ff9800 #f1f1f1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff9800;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #f57c00;
  }
`;

const TaskItemWrapper = styled.div<{ isDraggingOver: boolean }>`
  position: relative;
  &:after {
    content: "";
    display: ${(props) => (props.isDraggingOver ? "block" : "none")};
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #ff9800;
    bottom: 0;
  }
`;

const AddTaskInput = styled.input<{ isVisible: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 0.5rem;
  background: white;
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};

  &:focus {
    outline: none;
    border-color: #ff9800;
    color: #ff9800;
  }
`;

const AddButton = styled.button<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #ff9800;
  cursor: pointer;
  padding: 4px;
  margin-top: 0.5rem;
  font-size: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;

  &:hover {
    background: rgba(255, 152, 0, 0.1);
  }
`;

interface TaskListProps {
  date: string;
  tasks: Task[];
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  date,
  tasks,
  showInput,
  setShowInput,
}) => {
  const dispatch = useDispatch();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const isSelected = selectedDate === date;

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        taskId,
        fromDate: date,
      })
    );
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    if (draggedTaskId !== taskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { taskId, fromDate } = data;

    if (fromDate === date && taskId !== targetTaskId) {
      const currentTasks = [...tasks];
      const draggedTaskIndex = currentTasks.findIndex((t) => t.id === taskId);
      const targetTaskIndex = currentTasks.findIndex(
        (t) => t.id === targetTaskId
      );

      if (draggedTaskIndex !== -1 && targetTaskIndex !== -1) {
        const newTasks = [...currentTasks];
        const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
        newTasks.splice(targetTaskIndex, 0, draggedTask);

        const taskIds = newTasks.map((task) => task.id);

        dispatch(
          reorderTasks({
            date,
            taskIds,
          })
        );
      }
    }
    setDragOverTaskId(null);
  };

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (e.key === "Enter" && input.value.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        text: input.value.trim(),
        date,
        order: tasks.length,
      };
      dispatch(addTask(newTask));
      input.value = "";
      setShowInput(false);
    }
  };

  const handleEditTask = (taskId: string, newText: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      dispatch(
        moveTask({
          taskId,
          fromDate: date,
          toDate: date,
          newOrder: task.order,
          newText,
        })
      );
    }
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch({
      type: "tasks/deleteTask",
      payload: { taskId, date },
    });
  };

  return (
    <TaskListContainer isSelected={isSelected}>
       <AddTaskInput
        isVisible={isSelected && showInput}
        placeholder="Add task..."
        onKeyPress={handleAddTask}
        onBlur={() => setShowInput(false)}
        onClick={(e) => e.stopPropagation()}
      />
      {[...tasks].reverse().map((task) => (
        <TaskItemWrapper
          key={task.id}
          isDraggingOver={dragOverTaskId === task.id}
          onDragOver={(e) => handleDragOver(e, task.id)}
          onDrop={(e) => handleDrop(e, task.id)}
        >
          <TaskItem
            id={task.id}
            text={task.text}
            isDragging={task.id === draggedTaskId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        </TaskItemWrapper>
      ))}

     
    </TaskListContainer>
  );
};
