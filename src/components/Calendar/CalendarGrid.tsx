import React from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedDate } from '@/store/slices/calendarSlice';
import { getCalendarDays } from '@/utils/dateUtils';
import {
  WeekDaysGrid,
  WeekDay,
  CalendarGrid as StyledGrid,
  DayCell,
  DayNumber,
} from './styles';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface CalendarGridProps {
  currentDate: moment.Moment;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate);
  const calendarDays = getCalendarDays(currentDate);

  const handleDateClick = (date: moment.Moment) => {
    dispatch(setSelectedDate(date.format('YYYY-MM-DD')));
  };

  return (
    <>
      <WeekDaysGrid>
        {WEEKDAYS.map((day) => (
          <WeekDay key={day}>{day.slice(0, 3)}</WeekDay>
        ))}
      </WeekDaysGrid>
      <StyledGrid>
        {calendarDays.map(({ date, isCurrentMonth, isToday }) => (
          <DayCell
            key={date.format('YYYY-MM-DD')}
            isCurrentMonth={isCurrentMonth}
            isToday={isToday}
            isSelected={selectedDate === date.format('YYYY-MM-DD')}
            onClick={() => handleDateClick(date)}
          >
            <DayNumber className="day-number">
              {date.format('D')}
            </DayNumber>
          </DayCell>
        ))}
      </StyledGrid>
    </>
  );
};