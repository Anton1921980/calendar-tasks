import React, { useState, useRef, useEffect } from "react";
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
import { AddButton } from "../Calendar/styles";
import {TaskListContainer, TaskItemWrapper, AddTaskInput} from "./styles"


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
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const isSelected = selectedDate === date;

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

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
        ref={inputRef}
        isVisible={showInput}
        date={date}
        onKeyDown={handleAddTask}
        placeholder="Add task and press Enter"
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
      <AddButton isVisible={showInput} date={date} />
    </TaskListContainer>
  );
};
