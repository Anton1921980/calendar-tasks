import React from 'react';
import moment from 'moment';
import { setCurrentDate } from '~/store/slices/calendarSlice';
import { fetchTasks } from '~/store/slices/tasksSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { CalendarGrid } from './CalendarGrid';
import { AuthButton } from '../Auth/AuthButton';
import { WelcomeModal } from '../Auth/WelcomeModal';
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
  StatusFilters,
  StatusFilterButton,
  AuthIcons,
  DemoModeBanner
} from './styles';

export const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const [currentDate, setCurrentMoment] = React.useState(moment());
  const [view, setView] = React.useState('month');
  const [searchText, setSearchText] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'plan' | 'progress' | 'done'>('all');
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchTasks());
    // Hide welcome modal if user is authenticated
    if (isAuthenticated) {
      setShowWelcome(false);
    }
  }, [dispatch, isAuthenticated]); // Re-fetch when auth state changes

  const handleDateChange = (delta: number) => {
    const unit = view === 'month' ? 'month' : 'week';
    const newDate = currentDate.clone().add(delta, unit);
    setCurrentMoment(newDate);
    dispatch(setCurrentDate(newDate.format('YYYY-MM-DD')));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  const handleLoginClick = () => {
    setShowWelcome(false);
    setShowAuthModal(true);
  };

  return (
    <CalendarContainer>
      {!isAuthenticated && (
        <DemoModeBanner>
          DEMO MODE - Login to edit, delete, change status 
        </DemoModeBanner>
      )}
      <CalendarHeader>
        <AppTitle>Calendar Tasks</AppTitle>
        <StatusFilters>
          <StatusFilterButton 
            active={selectedStatus === 'all'} 
            onClick={() => setSelectedStatus('all')}
          >
            All
          </StatusFilterButton>
          <StatusFilterButton 
            active={selectedStatus === 'plan'} 
            status="plan" 
            onClick={() => setSelectedStatus('plan')}
          >
            Plan
          </StatusFilterButton>
          <StatusFilterButton 
            active={selectedStatus === 'progress'} 
            status="progress" 
            onClick={() => setSelectedStatus('progress')}
          >
            Progress
          </StatusFilterButton>
          <StatusFilterButton 
            active={selectedStatus === 'done'} 
            status="done" 
            onClick={() => setSelectedStatus('done')}
          >
            Done
          </StatusFilterButton>
        </StatusFilters>
        <SearchInput
          type="text"
          placeholder="Search tasks..."
          value={searchText}
          onChange={handleSearchChange}
        />
        <AuthIcons>
          <AuthButton isModalOpen={showAuthModal} onModalToggle={setShowAuthModal} />
        </AuthIcons>
      </CalendarHeader>
      <ControlsRow>
        <MonthNavigation>
          <NavButton onClick={() => handleDateChange(-1)}>&gt;</NavButton>          
          <NavButton onClick={() => handleDateChange(1)}>&lt;</NavButton>
        </MonthNavigation>
        <CurrentMonth>{currentDate.format('MMMM YYYY')}</CurrentMonth>
        <ViewControls>
          <ViewToggleButton
            isActive={view === 'month'}
            onClick={() => setView('month')}
          >
            Month
          </ViewToggleButton>
          <ViewToggleButton
            isActive={view === 'week'}
            onClick={() => setView('week')}
          >
            Week
          </ViewToggleButton>
        </ViewControls>
      </ControlsRow>
      <CalendarGrid
        currentDate={currentDate}
        view={view}
        searchText={searchText}
        selectedStatus={selectedStatus}
      />
      <WelcomeModal 
        isOpen={!isAuthenticated && showWelcome}
        onClose={handleWelcomeClose}
        onLoginClick={handleLoginClick}
      />
    </CalendarContainer>
  );
};