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
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
`;

export const WeekDay = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(120px, 1fr);
  background: #ffffff;
  height: calc(100vh - 130px);
`;

export const DayCell = styled.div<{ isCurrentMonth: boolean; isToday: boolean; isSelected: boolean }>`
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.5rem;
  position: relative;
  background: ${({ isCurrentMonth }) => isCurrentMonth ? '#ffffff' : '#f5f5f5'};
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ isToday }) => isToday && `
    .day-number {
      background: #ff9800;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `}

  ${({ isSelected }) => isSelected && `
    background: #fff3e0;
  `}

  &:hover {
    background: #f8f8f8;
  }
`;

export const DayNumber = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  padding: 2px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;