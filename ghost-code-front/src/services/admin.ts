import api from './api';

export const adminService = {
  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data;
  },
  async getSessions() {
    const res = await api.get('/admin/sessions');
    return res.data;
  },
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },
};