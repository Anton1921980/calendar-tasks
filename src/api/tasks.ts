import axios from './axios';
import { Task } from '../types/index';
import { NewTask } from '../store/slices/tasksSlice';
import moment from 'moment';

export const getTasks = async () => {
  const currentDate = moment();
  const monthStart = currentDate.clone().startOf('month');
  const monthEnd = currentDate.clone().endOf('month');
  const calendarStart = monthStart.clone().startOf('week');
  const calendarEnd = monthEnd.clone().endOf('week');

  // Format dates for API
  const startDate = calendarStart.format('YYYY-MM-DD');
  const endDate = calendarEnd.format('YYYY-MM-DD');

  const response = await axios.get<Task[]>(`/tasks/date/${startDate}/${endDate}`);
  return response.data;
};

export const createTask = async (task: NewTask) => {
  const response = await axios.post<Task>('/tasks', task);
  return response.data;
};

export const updateTask = async (taskId: string, task: Partial<Task>) => {
  const response = await axios.put<Task>(`/tasks/${taskId}`, task);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  await axios.delete(`/tasks/${taskId}`);
};