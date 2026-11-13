import api from './axios';
export const createDonation = (data) => api.post('/donations', data);
export const getDonations = (params) => api.get('/donations', { params });
export const getMyDonations = (params) => api.get('/donations/my', { params });
export const getDonation = (id) => api.get(`/donations/${id}`);
export const updateDonation = (id, data) => api.put(`/donations/${id}`, data);
export const deleteDonation = (id) => api.delete(`/donations/${id}`);

