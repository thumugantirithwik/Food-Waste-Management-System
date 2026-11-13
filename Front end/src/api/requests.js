import api from './axios';
export const createRequest = (data) => api.post('/requests', data);
export const getMyRequests = () => api.get('/requests/my');
export const getDonorRequests = () => api.get('/requests/for-donor');
export const getAllRequests = () => api.get('/requests');
export const approveRequest = (id) => api.put(`/requests/${id}/approve`);
export const rejectRequest = (id, reason) => api.put(`/requests/${id}/reject`, { reason });
export const cancelRequest = (id) => api.put(`/requests/${id}/cancel`);
export const markCollected = (id) => api.put(`/requests/${id}/mark-collected`);
export const markDelivered = (id) => api.put(`/requests/${id}/mark-delivered`);
export const completeRequest = (id) => api.put(`/requests/${id}/complete`);

