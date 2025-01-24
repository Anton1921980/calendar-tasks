import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

const TaskContainer = styled.div<{ isDragging: boolean }>`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.1rem;
  margin-bottom: 0.5rem;
  cursor: move;
  opacity: ${({ isDragging }) => isDragging ? 0.5 : 1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background: #f8f8f8;
    .task-actions {
      opacity: 1;
    }
  }
`;

const TaskText = styled.div`
  flex-grow: 1;
  margin-right: 0.5rem;
`;

const TaskInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  font-size: inherit;
  padding: 0;
  margin: 0;
  
  &:focus {
    outline: none;
  }
`;

const TaskActions = styled.div`
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  gap: 0.5rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff5252;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #ff1744;
  }
`;

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