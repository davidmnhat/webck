import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const btnSignupClick = async (e) => {
    e.preventDefault();
    const account = { username, password, name, phone, email };
    try {
      const res = await api.post('/customer/signup', account);
      if (res.data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Lỗi kết nối Server!');
    }
  };

  return (
    <div style={{ width: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#ff4d4f' }}>ĐĂNG KÝ TÀI KHOẢN</h2>
      <form onSubmit={btnSignupClick}>
        <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="tel" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px' }}>ĐĂNG KÝ</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        Đã có tài khoản? <Link to="/login" style={{ color: '#007bff' }}>Đăng nhập ngay</Link>
      </div>
    </div>
  );
};

export default Signup;