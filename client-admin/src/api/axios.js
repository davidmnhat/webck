import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL // Dòng này là quan trọng nhất!
});

// Tự động thêm Token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;