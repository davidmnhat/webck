import React, { useContext } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './Menu';
import Home from './Home';
import CategoryDetail from './CategoryDetail';
import ProductDetail from './ProductDetail';
import { Routes, Route, Navigate } from 'react-router-dom';
import Order from './Order';

const Main = () => {
  const { token } = useContext(MyContext);

  if (token === '') return <Navigate to="/login" />;

  return (
    <div className="body-admin">
      <Menu />
      <div className="right-panel">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/category" element={<CategoryDetail />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/" element={<Navigate to="/admin/home" />} />
          
          {/* SỬA LẠI DÒNG NÀY (Bỏ chữ /admin đi) */}
          <Route path='/order' element={<Order />} /> 
          
        </Routes>
      </div>
    </div>
  );
};
export default Main;