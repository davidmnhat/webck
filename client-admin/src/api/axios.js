import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Đổi port nếu server m chạy khác
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