import React, { useState, useRef, useEffect } from 'react';
import { TaskContainer, TaskText, TaskInput, TaskActions, DeleteButton, StatusChip, TaskContent } from "./styles";
import { FaTrash } from "react-icons/fa6";

interface TaskItemProps {
  _id: string;
  text: string;
  status: 'plan' | 'progress' | 'done';
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newText: string, newStatus?: 'plan' | 'progress' | 'done') => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  _id,
  text,
  status,
  isDragging = false,
  draggable = true,
  onDragStart,
  onDragEnd,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = {
      plan: 'progress',
      progress: 'done',
      done: 'plan',
    }[status] as 'plan' | 'progress' | 'done'; 
    onEdit(_id, text, nextStatus);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedText.trim() !== text) {
      onEdit(_id, editedText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editedText.trim() !== text) {
        onEdit(_id, editedText);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(_id);
  };

  return (      
    <TaskContainer
      isDragging={isDragging}
      draggable={!isEditing && draggable}
      onDragStart={(e) => onDragStart(e, _id)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
    >
      <TaskContent>
        <StatusChip status={status} onClick={handleStatusClick} />
        {isEditing ? (
          <TaskInput
            ref={inputRef}
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <TaskText onClick={handleClick}>{text}</TaskText>
        )}
      </TaskContent>
      <TaskActions>
        <DeleteButton onClick={handleDelete}>
          <FaTrash />
        </DeleteButton>
      </TaskActions>      
    </TaskContainer>  
  );
};