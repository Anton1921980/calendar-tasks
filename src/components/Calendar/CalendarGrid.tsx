import React, { useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setSelectedDate } from "@/store/slices/calendarSlice";
import { moveTask } from "@/store/slices/tasksSlice";
import { getCalendarDays, getWeekDays } from "@/utils/dateUtils";
import {
  WeekDaysGrid,
  WeekDay,
  CalendarGrid as StyledGrid,
  DayCell,
  DayNumber,
  AddButton,
} from "./styles";
import { TaskList } from "../Task/TaskList";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface CalendarGridProps {
  currentDate: moment.Moment;
  view: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, view }) => {
  
  const [showInput, setShowInput] = useState(false);  
  const dispatch = useDispatch();
 
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const tasks = useSelector((state: RootState) => state.tasks);

  const calendarDays = view === 'month' ? getCalendarDays(currentDate) : getWeekDays(currentDate);

  const handleDateClick = (date: moment.Moment) => {
    dispatch(setSelectedDate(date.format("YYYY-MM-DD")));
  };

  const handleDrop = (e: React.DragEvent, toDate: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { taskId, fromDate } = data;

    if (fromDate !== toDate) {
      const targetDateTasks = tasks[toDate] || [];
      dispatch(
        moveTask({
          taskId,
          fromDate,
          toDate,
          newOrder: targetDateTasks.length,
        })
      );
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
        {calendarDays.map(({ date, isCurrentMonth, isToday }) => {
          const dateStr = date.format("YYYY-MM-DD");
          const isSelected = dateStr === selectedDate;
          const dayTasks = tasks[dateStr] || [];

          return (
            <DayCell
              key={dateStr}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              isSelected={isSelected}
              onClick={() => handleDateClick(date)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <DayNumber className="day-number">
                <div>
                  {date.format("D")}
                  {dayTasks.length > 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                      {dayTasks.length} {dayTasks.length === 1 ? 'card' : 'cards'}
                    </span>
                  )}
                </div>
                <AddButton
                  isVisible={isSelected}
                  date={dateStr}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInput(true);
                  }}
                >
                  +
                </AddButton>
              </DayNumber>
              <TaskList
                date={dateStr}
                tasks={dayTasks}
                showInput={isSelected && showInput}
                setShowInput={setShowInput}
              />
            </DayCell>
          );
        })}
      </StyledGrid>
    </>
  );
};
