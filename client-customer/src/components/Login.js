import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import api from '../api/axios';

const Login = () => {
  const { setToken, setCustomer } = useContext(MyContext);
  const navigate = useNavigate();

  // STATE
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // XỬ LÝ ĐĂNG NHẬP
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
          
          // Lưu vào LocalStorage
          localStorage.setItem('customer_token', token);
          localStorage.setItem('customer', JSON.stringify(customer));

          alert('Đăng nhập thành công!');
          navigate('/');
        } else {
          alert(res.data.message);
        }
      });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    // Wrapper bọc ngoài để căn giữa toàn bộ trang
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f7fa', // Màu nền xám nhạt cho cả trang
      padding: '20px'
    }}>
      
      {/* Box Form Đăng Nhập */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
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
          Đăng nhập
        </h2>

        <form>
          {/* USERNAME */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#4a4a4a' 
            }}>
              Tên đăng nhập
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                border: '1px solid #e1e5eb', 
                borderRadius: '8px', 
                fontSize: '15px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }} 
              placeholder="Nhập tên đăng nhập của bạn..."
              onFocus={(e) => e.target.style.border = '1px solid #007bff'}
              onBlur={(e) => e.target.style.border = '1px solid #e1e5eb'}
            />
          </div>
          
          {/* PASSWORD */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#4a4a4a' 
            }}>
              Mật khẩu
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                border: '1px solid #e1e5eb', 
                borderRadius: '8px', 
                fontSize: '15px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }} 
              placeholder="Nhập mật khẩu..."
              onFocus={(e) => e.target.style.border = '1px solid #007bff'}
              onBlur={(e) => e.target.style.border = '1px solid #e1e5eb'}
            />
          </div>

          {/* BUTTON */}
          <button 
            type="submit" 
            onClick={btnLoginClick} 
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
            ĐĂNG NHẬP
          </button>
        </form>
        
        {/* FOOTER LINK */}
        <div style={{ 
          marginTop: '25px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          <span>Bạn chưa có tài khoản? </span>
          <Link 
            to="/signup" 
            style={{ 
              color: '#007bff', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Đăng ký ngay
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;