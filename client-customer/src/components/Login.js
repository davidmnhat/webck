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
  const btnLoginClick = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return alert('Vui lòng nhập đầy đủ thông tin');
    }
    const account = { username, password };

    try {
      // BƯỚC 1: Gõ cửa kho Khách hàng trước
      try {
        const resCus = await api.post('/customer/login', account);
        if (resCus.data && resCus.data.success) {
          const token = resCus.data.token;
          const customer = resCus.data.customer;

          setToken(token);
          setCustomer(customer);
          localStorage.setItem('customer_token', token);
          localStorage.setItem('customer', JSON.stringify(customer));

          alert('Đăng nhập Khách hàng thành công!');
          navigate('/');
          return; // Thành công thì dừng luôn
        }
      } catch (err) {
        // Lỗi 401 hoặc sai pass khách hàng thì im lặng để code trôi xuống Bước 2
      }

      // BƯỚC 2: Gõ cửa kho Admin
      try {
        const resAdm = await api.post('/admin/login', account);
        if (resAdm.data && resAdm.data.success) {
          const token = resAdm.data.token;
          // Lấy thông tin user, phòng hờ backend trả về tên biến khác
          const adminObj = resAdm.data.admin || resAdm.data.user || resAdm.data.account || { username };
          const adminStr = encodeURIComponent(JSON.stringify(adminObj));
          
          // Phóng thẳng sang trang Admin
          window.location.href = `https://admin.nhatvm.id.vn?token=${token}&admin=${adminStr}`;
          return;
        }
      } catch (err) {
        // Lỗi gọi API Admin
      }

      // BƯỚC 3: Nếu đi qua cả 2 cửa mà vẫn không return được -> Sai thật!
      alert('Sai tài khoản hoặc mật khẩu!');

    } catch (error) {
      alert('Lỗi hệ thống!');
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