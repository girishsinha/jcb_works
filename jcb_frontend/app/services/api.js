// src/services/api.js
"use client";
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor: Add access token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('✅ Attaching token:', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors for token refresh
api.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not the token refresh request itself, and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          console.warn('No refresh token found. Redirecting to login.');
          // IMPORTANT: You need to implement the redirect logic here.
          // For a React app, this typically means updating a global state
          // or using a history object from react-router-dom.
          // For now, I'll add a placeholder to demonstrate.
          // window.location.href = '/login'; // This is a simple but less React-idiomatic way
          // You might dispatch a logout action to clear global state and trigger redirect.
          return Promise.reject(error); // Reject the original error
        }

        // Request new access token using the refresh token
        const response = await axios.post(`${BASE_URL}token/refresh/`, {
          refresh: refreshToken,
        });

        const { access: newAccessToken, refresh: newRefreshToken } = response.data;

        // Store the new tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the authorization header for the original failed request
        // Ensure this applies to the `api` instance for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        // And also update the specific request being retried
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;


        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails (e.g., refresh token expired or invalid), clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // IMPORTANT: Redirect to login page
        // window.location.href = '/login'; // Simple but less React-idiomatic
        // Again, dispatch a logout action.
        return Promise.reject(refreshError); // Reject the refresh error
      }
    }
    return Promise.reject(error); // For other errors or if already retried
  }
);

export default api;

// Use the api instance for authenticated calls
export const getMachines = () => {
  return api.get('machines/');
};

export const getOperators = () => {
  return api.get('operators/'); // baseURL + 'operators/'
};

// export const createOperator = (data) => {
//   return api.post('operators/', data, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

export const createOperator = (data) => {
  //const token = localStorage.getItem('access_token'); // or from context
  const token = localStorage.getItem('accessToken');

  return api.post('operators/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
};


export const getFilteredWorkRecords = async (queryString) => {
  return await api.get(`workrecords/?${queryString}`);
};

export const updateSalary = (id, data) => {
  return api.patch(`salary/${id}/`, data);
};

// export const getMaintenance = (filters = '') =>
//   api.get(`/maintenance-records/?${filters}`);
export const getMaintenance = (query = '') =>
  api.get(`maintenance-records/${query ? `?${query}` : ''}`);


export const addMaintenance = (data) =>
  api.post('/maintenance-records/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateMaintenance = (id, data) =>
  api.put(`/maintenance-records/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteMaintenance = (id) =>
  api.delete(`/maintenance-records/${id}/`);


