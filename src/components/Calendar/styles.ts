import styled from '@emotion/styled';

export const CalendarContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0;
  background: #ffffff;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #ff9800;
  color: white;
`;

export const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const NavButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

export const CurrentMonth = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
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
  color: #666;
`;

export const AddButton = styled.button<{ isVisible: boolean }>`
  display: ${({ isVisible }) => isVisible ? 'inline-flex' : 'none'};
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