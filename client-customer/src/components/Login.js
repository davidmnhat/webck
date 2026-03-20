import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import api from '../api/axios';

const Login = () => {
  const { setToken, setCustomer } = useContext(MyContext);
  const navigate = useNavigate();

  // 1. TẠO STATE ĐỂ LƯU DỮ LIỆU NGƯỜI DÙNG NHẬP
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const btnLoginClick = (e) => {
    e.preventDefault();

    if (username && password) {
      const account = { username: username, password: password };
      
      api.post('/customer/login', account).then((res) => {
        if (res.data.success) {
          const token = res.data.token;
          const customer = res.data.customer;

          // Lưu vào Context
          setToken(token);
          setCustomer(customer);
          
          // Lưu vào LocalStorage (Để F5 không mất)
          localStorage.setItem('customer_token', token);
          localStorage.setItem('customer', JSON.stringify(customer));

          alert('Đăng nhập thành công!');
          navigate('/home');
        } else {
          alert(res.data.message);
        }
      });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#007bff' }}>ĐĂNG NHẬP</h2>
      <form>
        <div style={{ marginBottom: '15px' }}>
          <label>Tên đăng nhập:</label>
          <input 
            type="text" 
            value={username} // Gắn vào state
            onChange={(e) => setUsername(e.target.value)} // Gõ tới đâu lưu state tới đó
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            placeholder="Nhập username..."
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Mật khẩu:</label>
          <input 
            type="password" 
            value={password} // Gắn vào state
            onChange={(e) => setPassword(e.target.value)} // Gõ tới đâu lưu state tới đó
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            placeholder="Nhập password..."
          />
        </div>

        <button 
          type="submit" 
          onClick={btnLoginClick} // Bấm nút thì gọi hàm xử lý
          style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ĐĂNG NHẬP
        </button>
      </form>
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <span>Chưa có tài khoản? </span>
        <Link to="/signup" style={{ color: '#dc3545', textDecoration: 'none' }}>Đăng ký ngay</Link>
      </div>
    </div>
  );
};

export default Login;