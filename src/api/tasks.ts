import axios from './axios';
import { Task } from '../types/index';
import { NewTask } from '../store/slices/tasksSlice';

export const getTasks = async () => {
  const response = await axios.get<Task[]>('/tasks');
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