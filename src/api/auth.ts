import axios from './axios';

export interface AuthResponse {
  token: string;
  id: string;
}

export const login = async (email: string, password: string) => {
  const response = await axios.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await axios.post<AuthResponse>('/auth/register', { email, password });
  return response.data;
};