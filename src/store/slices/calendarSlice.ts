import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

interface CalendarState {
  currentDate: string;
  selectedDate: string | null;
}

const initialState: CalendarState = {
  currentDate: moment().format('YYYY-MM-DD'),
  selectedDate: null
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    }
  }
});

export const { setCurrentDate, setSelectedDate } = calendarSlice.actions;
export default calendarSlice.reducer;