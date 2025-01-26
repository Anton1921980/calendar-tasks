import React, { useState, useRef, useEffect } from 'react';
import {TaskContainer, TaskText, TaskInput, TaskActions, DeleteButton} from "./styles";

interface TaskItemProps {
  id: string;
  text: string;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  text,
  isDragging = false,
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

  const handleBlur = () => {
    setIsEditing(false);
    if (editedText.trim() !== text) {
      onEdit(id, editedText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editedText.trim() !== text) {
        onEdit(id, editedText);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <TaskContainer
      isDragging={isDragging}
      onDragStart={(e) => onDragStart(e, id)}
      onDragEnd={onDragEnd}
      draggable={!isEditing}
      onClick={handleClick}
    >
      {isEditing ? (
        <TaskInput
          ref={inputRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <TaskText>{text}</TaskText>
          <TaskActions className="task-actions">
            <DeleteButton onClick={handleDelete}>
            ✕
            </DeleteButton>
          </TaskActions>
        </>
      )}
    </TaskContainer>
  );
};