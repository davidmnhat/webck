import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Chỗ này cũng tự gắn Token nhưng là Token của khách hàng
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token');
    console.log('Token gửi đi:', token); // Thêm dòng này
  console.log('URL gọi:', config.url);
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

export default api;