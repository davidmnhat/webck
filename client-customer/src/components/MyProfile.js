import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import api from '../api/axios';

const MyProfile = () => {
  const { customer, setCustomer, token } = useContext(MyContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // 1. Load thông tin từ Context lên Form
  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email);
      // Nếu chưa có địa chỉ thì để rỗng
      setAddress(customer.address || ''); 
    }
  }, [customer]);

  const btnUpdateClick = (e) => {
    e.preventDefault();
    const body = { name, phone, email, address }; // Gửi cả address lên
    
    if (token) {
      api.put('/customer/profile', body).then((res) => {
        if (res.data.success) {
          const newCustomer = res.data.customer;

          // --- QUAN TRỌNG: CẬP NHẬT LẠI BỘ NHỚ ---
          // 1. Cập nhật Context (Để hiển thị ngay lập tức)
          setCustomer(newCustomer);
          
          // 2. Cập nhật LocalStorage (Để F5 không bị mất dữ liệu mới)
          localStorage.setItem('customer', JSON.stringify(newCustomer));
          // ---------------------------------------

          alert('✅ Cập nhật hồ sơ thành công!');
        } else {
          alert(res.data.message);
        }
      });
    } else {
      navigate('/login');
    }
  };

  if (!token) return <div></div>;

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#ff4d4f' }}>HỒ SƠ CÁ NHÂN</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Tên đăng nhập: </strong> <span>{customer?.username}</span>
      </div>

      <form>
        <label>Họ tên:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

        <label>Số điện thoại:</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

        <label>Địa chỉ mặc định:</label>
        <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Nhập địa chỉ giao hàng của bạn..." 
            style={{ width: '100%', padding: '8px', marginBottom: '20px' }} 
        />

        <button type="submit" onClick={btnUpdateClick} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          LƯU THAY ĐỔI
        </button>
      </form>
    </div>
  );
};

export default MyProfile;