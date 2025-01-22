import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setCurrentDate } from '@/store/slices/calendarSlice';
import { CalendarGrid } from './CalendarGrid';
import {
  CalendarContainer,
  CalendarHeader,
  MonthNavigation,
  NavButton,
  CurrentMonth,
} from './styles';

export const Calendar: React.FC = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentMoment] = React.useState(moment());

  const handleMonthChange = (delta: number) => {
    const newDate = currentDate.clone().add(delta, 'month');
    setCurrentMoment(newDate);
    dispatch(setCurrentDate(newDate.format('YYYY-MM-DD')));
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavigation>
          <NavButton onClick={() => handleMonthChange(-1)}>&lt;</NavButton>
          <CurrentMonth>
            {currentDate.format('MMMM YYYY')}
          </CurrentMonth>
          <NavButton onClick={() => handleMonthChange(1)}>&gt;</NavButton>
        </MonthNavigation>
      </CalendarHeader>
      <CalendarGrid currentDate={currentDate} />
    </CalendarContainer>
  );
};