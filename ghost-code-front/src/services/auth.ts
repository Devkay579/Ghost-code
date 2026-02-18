import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    return response.data; // { access_token }
  },
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data; // { access_token }
  },
  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};