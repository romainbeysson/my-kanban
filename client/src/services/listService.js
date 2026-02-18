import api from './api';

export const listService = {
  getByBoard: async (boardId) => {
    const response = await api.get(`/boards/${boardId}/lists`);
    return response.data;
  },

  create: async (boardId, data) => {
    const response = await api.post(`/boards/${boardId}/lists`, data);
    return response.data;
  },

  update: async (boardId, id, data) => {
    const response = await api.put(`/boards/${boardId}/lists/${id}`, data);
    return response.data;
  },

  delete: async (boardId, id) => {
    const response = await api.delete(`/boards/${boardId}/lists/${id}`);
    return response.data;
  },

  archive: async (boardId, id) => {
    const response = await api.post(`/boards/${boardId}/lists/${id}/archive`);
    return response.data;
  },

  reorder: async (boardId, lists) => {
    const response = await api.put(`/boards/${boardId}/lists/reorder`, { lists });
    return response.data;
  },
};
