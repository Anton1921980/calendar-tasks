import React, { useState, memo } from "react";
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
  HolidayText,
  HolidaysWrapper,
  TaskCount,
} from "./styles";
import { TaskList } from "../Task/TaskList";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import useHolidays from "../../hooks/useHolidays";

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
  searchText: string;
  selectedStatus: 'all' | 'plan' | 'progress' | 'done';
}

export const CalendarGrid = memo<CalendarGridProps>(({
  currentDate,
  view,
  searchText,
  selectedStatus,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { holidays, loading: holidaysLoading } = useHolidays(currentDate.year().toString());

  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const { items: tasks, fetchLoading } = useSelector((state: RootState) => state.tasks);

  if (fetchLoading) {
    return <LoadingSpinner />;
  }

  const calendarDays =
    view === "month" ? getCalendarDays(currentDate) : getWeekDays(currentDate);

  const handleDateClick = (date: moment.Moment, e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setSelectedDate(date.format("YYYY-MM-DD")));
  };

  const handleDrop = (e: React.DragEvent, toDate: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { taskId, fromDate } = data;

      if (fromDate !== toDate) {
        dispatch(
          moveTask({
            taskId,
            fromDate,
            toDate,
            newOrder: tasks[toDate]?.length || 0,
          })
        );
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  return (
    <>  
      {holidaysLoading && (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          holidays are loading!
        </div>
      )}
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
              onClick={(e) => handleDateClick(date, e)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <DayNumber className="day-number">
                {!isSelected && (
                  <>
                    {date.format("D")}
                    {dayTasks.length > 0 && (
                      <TaskCount>
                        {dayTasks.length}{" "}
                        {dayTasks.length === 1 ? "card" : "cards"}
                      </TaskCount>
                    )}
                  </>
                )}
              </DayNumber>
              <AddButton
                isVisible={isSelected}
                date={dateStr}
                isRotated={showInput && selectedDate === dateStr}
                onClick={(e) => {                 
                  e.stopPropagation();                  
                  if (showInput && selectedDate === dateStr) {                
                    setShowInput(false);
                    dispatch(setSelectedDate("")); // Deselect the date
                  } else {
                    dispatch(setSelectedDate(dateStr));
                    setShowInput(true);
                  }
                }}
              >
                +
              </AddButton>
              <HolidaysWrapper expanded={expandedDate === dateStr}>
                {(() => {
                  const dateHolidays = [
                    ...holidays
                        .filter((holiday) => holiday.date === dateStr)
                        .map((holiday) => holiday.name)                    
                  ];

                  if (dateHolidays.length === 0) return null;

                  if (dateHolidays.length === 1) {
                    return <HolidayText expanded={false}>
                      {dateHolidays[0].length > 22
                      ? `${dateHolidays[0].slice(0, 19)}...` 
                      : dateHolidays[0]}</HolidayText>;
                  }

                  return (
                    <>
                      <HolidayText
                        expanded={expandedDate === dateStr}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDate(
                            expandedDate === dateStr ? null : dateStr
                          );
                        }}                       
                      >                       
                        {expandedDate === dateStr
                          ? ""
                          : dateHolidays[0].length > 22
                            ? `${dateHolidays[0].slice(0, 19)}...` 
                            : dateHolidays[0]}{" "}
                        <span>
                          {" "}
                          ▼{" "}
                        </span>
                      </HolidayText>
                      {expandedDate === dateStr && (
                        <div className="holidays-dropdown">
                          {dateHolidays.map((holiday, index) => (
                            <HolidayText
                              key={index}
                              style={{ marginTop: "2px" }}
                              className="expanded"
                              expanded={true}
                            >
                              {holiday}
                            </HolidayText>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </HolidaysWrapper>
              {expandedDate !== dateStr && (
                 <TaskList
                 date={dateStr}
                 tasks={dayTasks}
                 showInput={isSelected && showInput}
                 setShowInput={setShowInput}
                 searchText={searchText}
                 selectedStatus={selectedStatus}
               />
              )}
             
            </DayCell>
          );
        })}
      </StyledGrid>
    </>
  );
});
