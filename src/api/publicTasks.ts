import axios from 'axios';
import { Task } from '../types/index';
import moment from 'moment';
import { API_URL } from '../config/env';

const publicAxios = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPublicTasks = async () => {
  const currentDate = moment();
  const monthStart = currentDate.clone().startOf('month');
  const monthEnd = currentDate.clone().endOf('month');
  const calendarStart = monthStart.clone().startOf('week');
  const calendarEnd = monthEnd.clone().endOf('week');

  // Format dates for API
  const startDate = calendarStart.format('YYYY-MM-DD');
  const endDate = calendarEnd.format('YYYY-MM-DD');

  // Using a different endpoint for public tasks
  const response = await publicAxios.get<Task[]>(`/tasks/public/date/${startDate}/${endDate}`);
  return response.data;
};