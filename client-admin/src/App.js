import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import Login from './components/Login';
import Main from './components/Main';

// ==============================================================
// 1. CHẶN ĐỌC THẺ VIP NGAY TỪ NGOÀI CỬA (TRƯỚC KHI RENDER WEB)
// ==============================================================
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const adminData = urlParams.get('admin');

if (token) {
      localStorage.setItem('token', token);

      if (adminData) {
        const adminObj = JSON.parse(decodeURIComponent(adminData));
        localStorage.setItem('username', adminObj.username || 'admin');
      }

      window.location.replace("/admin"); 
    }
// ==============================================================

function App() {
  // 2. Nếu đang bận chuyển hướng, tạm thời nhắm mắt không render cái gì cả
  // Để tránh bị thằng Router nó "nhanh tay" sút ra trang Login
  if (token) return null; 

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