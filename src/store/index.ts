import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './slices/calendarSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;