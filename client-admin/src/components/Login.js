import React, { useState, useContext } from 'react';
import api from '../api/axios';
import MyContext from '../contexts/MyContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUsername: setContextUsername } = useContext(MyContext);
  const navigate = useNavigate();

  const btnLoginClick = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { username, password });
      if (res.data.success) {
        setToken(res.data.token);
        setContextUsername(username);
        localStorage.setItem('token', res.data.token); // Lưu cứng vào trình duyệt
        navigate('/admin/home');
      } else {
        alert('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (err) { alert('Lỗi kết nối Server!'); }
  };

  return (
    <div className="align-center">
      <h2>ADMIN LOGIN</h2>
      <form onSubmit={btnLoginClick}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>
        <input type="submit" value="LOGIN" />
      </form>
    </div>
  );
};
export default Login;