import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import Login from './components/Login';
import Main from './components/Main';

function App() {

  // ===== THÊM ĐOẠN NÀY ĐỂ BẮT TOKEN TỪ KHÁCH HÀNG CHUYỂN SANG =====
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const adminData = urlParams.get('admin');

    if (token && adminData) {
      // 1. Giải mã thông tin admin
      const admin = JSON.parse(decodeURIComponent(adminData));

      // 2. Lưu vào máy 
      localStorage.setItem('admin_token', token); 
      localStorage.setItem('admin', JSON.stringify(admin));

      // 3. Phá cửa đi thẳng vào trong! 
      window.location.href = "/admin/home"; 
    }
  }, []);
  // ===============================================================

  return (
    <MyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Main />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
}

export default App;