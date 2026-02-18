import api from './api';

export const cardService = {
  getById: async (id) => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  create: async (listId, data) => {
    const response = await api.post(`/lists/${listId}/cards`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/cards/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  },

  archive: async (id) => {
    const response = await api.post(`/cards/${id}/archive`);
    return response.data;
  },

  move: async (id, listId, position) => {
    const response = await api.put(`/cards/${id}/move`, { listId, position });
    return response.data;
  },

  reorder: async (cards) => {
    const response = await api.put('/cards/reorder', { cards });
    return response.data;
  },

  addAssignee: async (id, userId) => {
    const response = await api.post(`/cards/${id}/assignees`, { userId });
    return response.data;
  },

  removeAssignee: async (id, userId) => {
    const response = await api.delete(`/cards/${id}/assignees/${userId}`);
    return response.data;
  },
};
