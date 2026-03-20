import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // (Hoặc './index.css' tùy tên file m đặt)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// XÓA DÒNG reportWebVitals(); Ở ĐÂY ĐI NHÉ