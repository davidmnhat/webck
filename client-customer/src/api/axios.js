import axios from 'axios';

const api = axios.create({
  // Nếu đang chạy ở máy mình (localhost) thì gọi thẳng port 3000
  // Nếu không phải localhost thì mới dùng link ngrok
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://postdetermined-parachronistic-donya.ngrok-free.dev/api',
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