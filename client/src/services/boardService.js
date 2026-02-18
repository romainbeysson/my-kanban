import api from './api';

export const boardService = {
  getAll: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/boards', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },

  archive: async (id) => {
    const response = await api.post(`/boards/${id}/archive`);
    return response.data;
  },

  addMember: async (id, email) => {
    const response = await api.post(`/boards/${id}/members`, { email });
    return response.data;
  },

  removeMember: async (id, memberId) => {
    const response = await api.delete(`/boards/${id}/members/${memberId}`);
    return response.data;
  },
};
