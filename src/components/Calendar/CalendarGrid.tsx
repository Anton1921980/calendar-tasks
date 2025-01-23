import React from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedDate } from '@/store/slices/calendarSlice';
import { moveTask } from '@/store/slices/tasksSlice';
import { getCalendarDays } from '@/utils/dateUtils';
import {
  WeekDaysGrid,
  WeekDay,
  CalendarGrid as StyledGrid,
  DayCell,
  DayNumber,
} from './styles';
import { TaskList } from '../Task/TaskList';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface CalendarGridProps {
  currentDate: moment.Moment;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const calendarDays = getCalendarDays(currentDate);

  const handleDateClick = (date: moment.Moment) => {
    dispatch(setSelectedDate(date.format('YYYY-MM-DD')));
  };

  const handleDrop = (e: React.DragEvent, toDate: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { taskId, fromDate } = data;
    
    if (fromDate !== toDate) {
      const targetDateTasks = tasks[toDate] || [];
      dispatch(moveTask({
        taskId,
        fromDate,
        toDate,
        newOrder: targetDateTasks.length
      }));
    }
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, date.format('YYYY-MM-DD'))}
          >
            <DayNumber className="day-number">
              {date.format('D')}
            </DayNumber>
            <TaskList
              date={date.format('YYYY-MM-DD')}
              tasks={tasks[date.format('YYYY-MM-DD')] || []}
            />
          </DayCell>
        ))}
      </StyledGrid>
    </>
  );
};