import React, { useState, useContext } from 'react';
import api from '../api/axios';
import MyContext from '../contexts/MyContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUsername: setContextUsername } = useContext(MyContext);
  const navigate = useNavigate();

  const btnLoginClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/admin/login', { username, password });
      if (res.data.success) {
        setToken(res.data.token);
        setContextUsername(username);
        localStorage.setItem('token', res.data.token);
        navigate('/admin/home');
      } else {
        alert('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (err) {
      alert('Lỗi kết nối Server!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #ffffff;
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .login-box {
            background: #ffffff;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid #f0f0f0;
            text-align: center;
          }

          .login-title {
            margin: 0;
            color: #1a1a1a;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .login-subtitle {
            color: #666666;
            font-size: 14px;
            margin-top: 8px;
            margin-bottom: 30px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
          }

          .input-group {
            margin-bottom: 20px;
          }

          .login-input {
            width: 100%;
            padding: 14px 16px;
            border: 1.5px solid #e0e0e0;
            border-radius: 8px;
            font-size: 15px;
            color: #333;
            transition: all 0.3s ease;
            box-sizing: border-box;
          }

          .login-input:focus {
            outline: none;
            border-color: #000000;
            box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
          }

          .login-input::placeholder {
            color: #a0a0a0;
          }

          .login-button {
            width: 100%;
            padding: 14px;
            background-color: #1a1a1a;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
          }

          .login-button:hover:not(:disabled) {
            background-color: #333333;
            transform: translateY(-1px);
          }

          .login-button:active:not(:disabled) {
            transform: translateY(0);
          }

          .login-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
        `}
      </style>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Admin Portal</h2>
          <p className="login-subtitle">Vui lòng đăng nhập để tiếp tục</p>

          <form onSubmit={btnLoginClick} className="login-form">
            <div className="input-group">
              <input
                type="text"
                className="login-input"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                className="login-input"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;