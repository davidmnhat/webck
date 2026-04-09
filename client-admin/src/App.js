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
    const tokenFromCustomer = urlParams.get('token');

    if (tokenFromCustomer) {
      // 1. Lưu token vào máy của Admin 
      localStorage.setItem('token', tokenFromCustomer); 
      
      // 2. Xóa cái đuôi ?token=... trên URL đi cho bảo mật và đẹp link
      window.history.replaceState({}, document.title, "/");

      // 3. Tải lại trang 1 lần để hệ thống (MyProvider/Router) nhận diện token mới và cho vào thẳng
      window.location.reload(); 
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