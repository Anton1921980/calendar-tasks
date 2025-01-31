import React, { useState, useRef, useEffect } from "react";
import { Task, createTask, updateTaskThunk, deleteTaskThunk } from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { TaskItem } from "./TaskItem";
import { RootState } from "@/store";
import { TaskListContainer, TaskItemWrapper, AddTaskInput } from "./styles";

interface TaskListProps {
  date: string;
  tasks: Task[];
  showInput: boolean;
  setShowInput: (show: boolean) => void;
  searchText: string;
  selectedStatus: 'all' | 'plan' | 'progress' | 'done';
}

export const TaskList: React.FC<TaskListProps> = ({
  date,
  tasks,
  showInput,
  setShowInput,
  searchText,
  selectedStatus,
}) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom'>('bottom');

  const selectedDate = useAppSelector(
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
    setDragPosition('bottom');
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = rect.top + rect.height / 2;
    const position = mouseY < threshold ? 'top' : 'bottom';
    
    if (dragOverTaskId !== taskId || dragPosition !== position) {
      setDragOverTaskId(taskId);
      setDragPosition(position);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTaskId(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { taskId, fromDate } = data;

      if (taskId === targetTaskId) {
        return; // Don't do anything if dropping on the same task
      }

      const targetTask = tasks.find((t) => t._id === targetTaskId);
      if (!targetTask) return;

      // Calculate new order based on surrounding tasks
      const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
      const targetIndex = sortedTasks.findIndex(t => t._id === targetTaskId);
      
      let newOrder: number;
      if (dragPosition === 'top') {
        const prevTask = targetIndex > 0 ? sortedTasks[targetIndex - 1] : null;
        newOrder = prevTask 
          ? (prevTask.order + targetTask.order) / 2 
          : targetTask.order - 1;
      } else {
        const nextTask = targetIndex < sortedTasks.length - 1 ? sortedTasks[targetIndex + 1] : null;
        newOrder = nextTask 
          ? (targetTask.order + nextTask.order) / 2 
          : targetTask.order + 1;
      }

      try {
        await dispatch(updateTaskThunk({
          taskId,
          fromDate,
          toDate: date,
          newOrder
        })).unwrap();
      } catch (error) {
        // If the API call fails but we're in demo mode, the local state will still be updated
        if (error instanceof Error && error.message !== 'You need to be authenticated to edit tasks') {
          console.error('Error during drag and drop:', error);
        }
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handleCreateTask = async (text: string) => {
    try {
      await dispatch(createTask({
        text,
        date,
        order: -1, // This will ensure the task appears at the top
        status: 'plan'
      })).unwrap();
      setShowInput(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTaskThunk({ taskId, date })).unwrap();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskEdit = (taskId: string, newText: string, newStatus?: 'plan' | 'progress' | 'done') => {
    console.log('TaskList - Edit called with:', { taskId, newText, newStatus });
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      console.log('TaskList - Found task:', task);
      console.log('TaskList - Dispatching update with:', {
        taskId,
        fromDate: date,
        toDate: date,
        newOrder: task.order,
        newText,
        newStatus
      });
      dispatch(
        updateTaskThunk({
          taskId,
          fromDate: date,
          toDate: date,
          newOrder: task.order,
          newText,
          newStatus
        })
      );
    }
  };

  return (   
    <TaskListContainer isSelected={isSelected}>

      {showInput && (
        <AddTaskInput
          ref={inputRef}
          placeholder="Enter task..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputRef.current?.value.trim()) {
              handleCreateTask(inputRef.current.value.trim());
              inputRef.current.value = "";
            }
          }}
          onBlur={() => setShowInput(false)}
          isVisible={showInput}
          date={date}
        />
      )}
      {tasks
        .filter(
          (task) =>
            (!searchText || task.text.toLowerCase().includes(searchText.toLowerCase())) &&
            (selectedStatus === 'all' || task.status === selectedStatus)
        )
        .map((task) => (
          <TaskItemWrapper
            key={task._id}
            onDragOver={(e) => handleDragOver(e, task._id)}
            onDragLeave={() => setDragOverTaskId(null)}
            onDrop={(e) => handleDrop(e, task._id)}
            $isDragOver={dragOverTaskId === task._id}
            $dragPosition={dragOverTaskId === task._id ? dragPosition : undefined}
          >
            <TaskItem
              _id={task._id}
              text={task.text}
              status={task.status}
              isDragging={draggedTaskId === task._id}
              onDragStart={(e) => handleDragStart(e, task._id)}
              onDragEnd={handleDragEnd}
              onDelete={handleDeleteTask}
              onEdit={handleTaskEdit}
            />
          </TaskItemWrapper>
        ))}
    </TaskListContainer> 
  );
};
