import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Task, addTask, moveTask } from '@/store/slices/tasksSlice';
import { TaskItem } from './TaskItem';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

const TaskListContainer = styled.div`
  margin-top: 0.5rem;
`;

const AddTaskInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 0.5rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #ff9800;
    color: #ff9800;
  }
`;

interface TaskListProps {
  date: string;
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ date, tasks }) => {
  const dispatch = useDispatch();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', JSON.stringify({
      taskId,
      fromDate: date
    }));
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (e.key === 'Enter' && input.value.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        text: input.value.trim(),
        date,
        order: tasks.length
      };
      dispatch(addTask(newTask));
      input.value = '';
    }
  };

  return (
    <TaskListContainer>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          text={task.text}
          isDragging={task.id === draggedTaskId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
      <AddTaskInput
        placeholder="Add task..."
        onKeyPress={handleAddTask}
      />
    </TaskListContainer>
  );
};