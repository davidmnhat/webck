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

  // CSS dùng chung cho các input để code đỡ dài
  const inputStyle = {
    width: '100%', 
    padding: '14px 16px', 
    border: '1px solid #e1e5eb', 
    borderRadius: '8px', 
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block', 
    marginBottom: '8px', 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#4a4a4a'
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f7fa',
      padding: '40px 20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px', // Form đăng ký cho rộng hơn form login một chút
        backgroundColor: '#ffffff',
        padding: '40px 30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        borderRadius: '16px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#1d1d1f', 
          fontSize: '28px', 
          fontWeight: '700', 
          marginBottom: '30px',
          letterSpacing: '-0.5px'
        }}>
          Đăng ký tài khoản
        </h2>

        <form onSubmit={btnSignupClick}>
          
          <div>
            <label style={labelStyle}>Họ và tên</label>
            <input 
              type="text" 
              placeholder="Nhập họ và tên..." 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={inputStyle} 
              onFocus={(e) => e.target.style.border = '1px solid #007bff'}
              onBlur={(e) => e.target.style.border = '1px solid #e1e5eb'}
            />
          </div>

          <div>
            <label style={labelStyle}>Tên đăng nhập</label>
            <input 
              type="text" 
              placeholder="Nhập tên đăng nhập..." 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={inputStyle} 
              onFocus={(e) => e.target.style.border = '1px solid #007bff'}
              onBlur={(e) => e.target.style.border = '1px solid #e1e5eb'}
            />
          </div>

          <div>
            <label style={labelStyle}>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="Nhập mật khẩu..." 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={inputStyle} 
              onFocus={(e) => e.target.style.border = '1px solid #007bff'}
              onBlur={(e) => e.target.style.border = '1px solid #e1e5eb'}
            />
          </div>

          <div>
            <label style={labelStyle}>Số điện thoại</label>
            <input 
              type="tel" 
              placeholder="Nhập số điện thoại..." 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              style={inputStyle} 
              onFocus={(e) => e.target.style.border = '1px solid #007bff'}
              onBlur={(e) => e.target.style.border = '1px solid #e1e5eb'}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input 
              type="email" 
              placeholder="Nhập địa chỉ email..." 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{...inputStyle, marginBottom: '30px'}} // Margin bự hơn ở ô cuối
              onFocus={(e) => e.target.style.border = '1px solid #007bff'}
              onBlur={(e) => e.target.style.border = '1px solid #e1e5eb'}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            ĐĂNG KÝ
          </button>
        </form>

        <div style={{ 
          marginTop: '25px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          <span>Đã có tài khoản? </span>
          <Link 
            to="/login" 
            style={{ 
              color: '#007bff', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;