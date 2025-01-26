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
  AppTitle,
  ViewControls,
  ViewToggleButton,
  ControlsRow,
  SearchInput,
} from './styles';



export const Calendar: React.FC = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentMoment] = React.useState(moment());
  const [view, setView] = React.useState('month');
  const [searchText, setSearchText] = React.useState('');

  const handleMonthChange = (delta: number) => {
    const newDate = currentDate.clone().add(delta, 'month');
    setCurrentMoment(newDate);
    dispatch(setCurrentDate(newDate.format('YYYY-MM-DD')));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <AppTitle>Calendar</AppTitle>
        <SearchInput
          type="text"
          placeholder="Search tasks..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </CalendarHeader>
      <ControlsRow>
        <MonthNavigation>
          <NavButton onClick={() => handleMonthChange(-1)}>&gt;</NavButton>         
          <NavButton onClick={() => handleMonthChange(1)}>&lt;</NavButton>
        </MonthNavigation>
        <CurrentMonth>
            {currentDate.format('MMMM YYYY')}
          </CurrentMonth>
        <ViewControls>
          <ViewToggleButton 
            isActive={view === 'week'} 
            onClick={() => setView('week')}
          >
            Week
          </ViewToggleButton>
          <ViewToggleButton 
            isActive={view === 'month'} 
            onClick={() => setView('month')}
          >
            Month
          </ViewToggleButton>
        </ViewControls>
      </ControlsRow>
      <CalendarGrid currentDate={currentDate} view={view} searchText={searchText} />
    </CalendarContainer>
  );
};