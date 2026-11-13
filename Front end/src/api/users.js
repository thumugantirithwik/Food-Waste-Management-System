import api from './axios';
export const getUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const verifyUser = (id) => api.put(`/users/${id}/verify`);
export const suspendUser = (id) => api.put(`/users/${id}/suspend`);
export const updateProfile = (data) => api.put('/users/profile', data);

