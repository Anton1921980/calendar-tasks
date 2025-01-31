import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './slices/calendarSlice';
import tasksReducer from './slices/tasksSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    tasks: tasksReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;