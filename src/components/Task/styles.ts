import styled from '@emotion/styled';

export const TaskListContainer = styled.div<{ isSelected: boolean }>`
  margin-top: 0.5rem;
  position: absolute;
  top: 25px;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow-y: ${({ isSelected }) => (isSelected ? "auto" : "hidden")};
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

interface TaskItemWrapperProps {
  $isDragOver?: boolean;
  $dragPosition?: 'top' | 'bottom';
}

export const TaskItemWrapper = styled.div<TaskItemWrapperProps>`
  margin: 4px 0;
  position: relative;
  transition: opacity 0.2s;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ff9800;
    opacity: ${({ $isDragOver }) => ($isDragOver ? 1 : 0)};
    ${({ $dragPosition }) => $dragPosition === 'top' ? 'top: -1px;' : 'bottom: -1px;'}
    transition: opacity 0.2s;
  }
`;

export const AddTaskInput = styled.input<{ isVisible: boolean, date: string }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  background: white;
  display: ${({ isVisible, date }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buttonDate = new Date(date);
  buttonDate.setHours(0, 0, 0, 0);
  console.log(isVisible, date)
  return isVisible && buttonDate >= today ? "flex" : "none"

}};

  &:focus {
    outline: none;
    border-color: #ff9800;
    color: #ff9800;
  }
`;


export const TaskContainer = styled.div<{ isDragging?: boolean }>`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.1rem;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: move;
  // opacity: ${({ isDragging }) => isDragging ? 0.5 : 1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  
  &:hover {
    background: #f8f8f8;
    .task-actions {
      opacity: 1;
    }
  }
`;

export const StatusChip = styled.div<{ status: 'plan' | 'progress' | 'done' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  cursor: pointer;
  background-color: ${({ status }) => {
    switch (status) {
      case 'plan':
        return '#ffd700'; // yellow
      case 'progress':
        return '#87ceeb'; // light blue
      case 'done':
        return '#90ee90'; // light green
      default:
        return '#ffd700';
    }
  }};
  &:hover {
    opacity: 0.8;
  }
`;

export const TaskContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const TaskText = styled.div`
  flex-grow: 1;
  margin-right: 0.5rem;
`;

export const TaskInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  font: inherit;
  font-size: inherit;
  padding: 0.1rem;
  margin: 0;
  color: #ff9800;
  
  &:focus {
    outline: none;
  }
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-right: 8px;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff5252;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    color: #ff1744;
    background-color: rgba(255, 82, 82, 0.1);
    border-radius: 4px;
  }
&:focus {
    outline: none;    
  }
  svg {
    width: 14px;
    height: 14px;
  }
`;