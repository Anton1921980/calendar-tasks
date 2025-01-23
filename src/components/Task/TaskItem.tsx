import React from 'react';
import styled from '@emotion/styled';

const TaskContainer = styled.div<{ isDragging: boolean }>`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: move;
  opacity: ${({ isDragging }) => isDragging ? 0.5 : 1};
  
  &:hover {
    background: #f8f8f8;
  }
`;

interface TaskItemProps {
  id: string;
  text: string;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  text,
  isDragging = false,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <TaskContainer
      draggable
      isDragging={isDragging}
      onDragStart={(e) => onDragStart(e, id)}
      onDragEnd={onDragEnd}
    >
      {text}
    </TaskContainer>
  );
};