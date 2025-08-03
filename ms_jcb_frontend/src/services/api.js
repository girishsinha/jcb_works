// src/services/api.js
import axios from 'axios';
export const getUserInfo = () => api.get('user/');

const BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // console.log('✅ Attaching token:', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.warn('🔒 No refresh token found. Redirecting to login.');
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}token/refresh/`, {
          refresh: refreshToken,
        });

        const { access: newAccessToken, refresh: newRefreshToken } = res.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error('🔁 Token refresh failed:', refreshError);
        clearTokensAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const redirectToLogin = () => {
  window.location.href = '/login'; // Replace with router logic if needed
};

const clearTokensAndRedirect = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  redirectToLogin();
};

export default api;

//
// ✅ Authenticated API Calls
//

export const getMachines = () => api.get('machines/');
export const getOperators = () => api.get('operators/');
export const getFilteredWorkRecords = (query) => api.get(`workrecords/?${query}`);
export const updateSalary = (id, data) => api.patch(`salary/${id}/`, data);

// Operators
export const createOperator = (data) =>
  api.post('operators/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Maintenance
export const getMaintenance = (query = '') =>
  api.get(`maintenance-records/${query ? `?${query}` : ''}`);

export const addMaintenance = (data) =>
  api.post('maintenance-records/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateMaintenance = (id, data) =>
  api.put(`maintenance-records/<int:pk>/update/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteMaintenance = (id) => api.delete(`maintenance-records/${id}/`);

export const createMachine = (data) =>
  api.post('machines/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteMachine = (id, reason) =>
  api.delete(`machines/${id}/`, {
    data: { reason },
  });

export const updateMachine = (id, data) =>
  api.put(`machines/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });


export const registerUser = (data) =>
  api.post('register-user/', data);

