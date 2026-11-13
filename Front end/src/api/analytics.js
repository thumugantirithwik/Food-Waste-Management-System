import api from './axios';
export const getOverview = () => api.get('/analytics/overview');
export const getTrends = (period) => api.get('/analytics/trends', { params: { period } });
export const getCategories = () => api.get('/analytics/categories');
export const getDonorStats = () => api.get('/analytics/donor-stats');
export const getNGOStats = () => api.get('/analytics/ngo-stats');

