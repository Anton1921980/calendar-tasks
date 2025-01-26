import styled from '@emotion/styled';

export const CalendarContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;  
  background: #ff9800;
  padding: 12px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  user-select: none;
`;

export const AppTitle = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 500;
`;

export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  user-select: none;
`;

export const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const ViewControls = styled.div`
  display: flex;
  gap: 4px;
`;

export const NavButton = styled.button`
  width: 28px;
  height: 28px; 
  border: none;
  border-radius: 4px;
  padding: 1px 0;
  background: lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  transform: rotate(90deg);
  color: #666;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  &:focus {
    outline: none;
  }
`;

export const CurrentMonth = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #666;
`;

export const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

export const WeekDay = styled.div`
  padding: 0.5rem;
  text-align: center;
  font-weight: 500;
  color: #666;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  height: calc(100vh - 150px);
`;

export const DayCell = styled.div<{ isSelected: boolean; isCurrentMonth: boolean; isToday?: boolean }>`
  background: white;
  padding: 0.5rem;
  position: relative;
  cursor: pointer;
   user-select: none;
  outline: none;
  opacity: ${({ isCurrentMonth }) => isCurrentMonth ? 1 : 0.5};
  
  ${({ isSelected }) => isSelected && `
    background: #fff3e0;
  `}
  
  ${({ isToday }) => isToday && `
    .day-number {
      color: #ff9800;
      font-weight: bold;
    }
  `}
  
  &:hover {
    background: ${({ isSelected }) => isSelected ? '#fff3e0' : '#f8f8f8'};
  }
`;

export const DayNumber = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #666;
`;

export const AddButton = styled.button<{ isVisible: boolean; date: string }>`
display: ${({ isVisible, date }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buttonDate = new Date(date);
  buttonDate.setHours(0, 0, 0, 0);
  return isVisible && buttonDate >= today ? "flex" : "none"
}};
  align-items: center;
  justify-content: center;
  background: none;
  border: none; 
  color: #ff9800;
  cursor: pointer;
  padding: 2px;
  font-size: 14px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 4px;
  font-size: 1.5rem;
  
  &:hover {
    background: rgba(255, 152, 0, 0.1);
  }
  &:focus {
     outline: none;
  }
`;

export const ViewToggleContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ViewToggleButton = styled.button<{ isActive: boolean }>`
  padding: 4px 12px;
  border: none;
  background: ${({ isActive }) => isActive ? '#e0e0e0' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  font-size: 13px;
  font-weight: 700;

  &:hover {
    background: ${({ isActive }) => isActive ? '#e0e0e0' : '#fff'};
  }

  &:focus {
    outline: none;
  }
`;

export const SearchInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: none;
  margin-left: 10px;
  width: 200px;
  background-color: #f5f5f5;
  color: #000000;
  
  &:focus {
    outline: none;
    
    color: #ff9800;
  }
`;
