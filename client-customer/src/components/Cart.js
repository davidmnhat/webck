import React, { useState, useContext, useEffect } from 'react';
import MyContext from '../contexts/MyContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Cart = () => {
  const { mycart, removeFromCart, updateCart, customer, clearCart } = useContext(MyContext);
  const navigate = useNavigate();

  // Tạo state cho Form Thanh Toán
  const [isCheckout, setIsCheckout] = useState(false); // Công tắc hiện/ẩn form
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Nếu khách đã đăng nhập, tự điền sẵn số điện thoại cho họ đỡ phải gõ
  useEffect(() => {
    if (customer) setPhone(customer.phone);
  }, [customer]);

  const btnCheckoutClick = () => {
    if (!customer) {
      alert('Bình tĩnh! Bạn phải Đăng nhập mới được chốt đơn nhé!');
      navigate('/login');
      return;
    }
    // Bật công tắc hiện Form Thanh Toán lên
    setIsCheckout(true);
  };
  useEffect(() => {
    if (customer) {
      setPhone(customer.phone);
      // Nếu trong hồ sơ có địa chỉ thì điền luôn, đỡ phải gõ lại
      if (customer.address) {
        setAddress(customer.address);
      }
    }
  }, [customer]);
  // HÀM MỚI: Xử lý khi bấm nút "XÁC NHẬN MUA" ở dưới Form
  const submitOrder = async (e) => {
    e.preventDefault(); // Chặn load trang

    if (window.confirm('Bạn có chắc chắn muốn đặt hàng không?')) {
      const items = mycart.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));
      const total = mycart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      // Đóng gói data gửi lên Server
      const body = { items, total, phone, address, paymentMethod };

      try {
        const res = await api.post('/order/checkout', body);
        if (res.data.success) {
          alert('🎉 Đặt hàng thành công! Đơn hàng sẽ sớm được giao tới bạn.');
          clearCart();
          navigate('/');
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        alert('Lỗi kết nối Server! Vui lòng thử lại.');
      }
    }
  };

  if (mycart.length === 0) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Giỏ hàng của bạn đang trống! 🛒 Về trang chủ mua sắm ngay.</h2>;

  const total = mycart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>🛒 GIỎ HÀNG CỦA BẠN</h2>
      
      {/* Bảng Giỏ hàng (Giữ nguyên như cũ) */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }} border="1">
        <thead>
          <tr style={{ backgroundColor: '#ff4d4f', color: 'white', textAlign: 'center', height: '40px' }}>
            <th>STT</th><th>Hình ảnh</th><th>Tên sản phẩm</th><th>Tùy chọn</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {mycart.map((item, index) => (
            <tr key={index} style={{ textAlign: 'center', backgroundColor: 'white' }}>
              <td>{index + 1}</td>
              <td><img src={item.product.image} alt={item.product.name} width="70px" style={{ objectFit: 'contain' }}/></td>
              <td><strong>{item.product.name}</strong></td>
              <td><span style={{ fontSize: '14px', color: '#555' }}>{item.color && <div>Màu: {item.color}</div>}{item.memory && <div>Cấu hình: {item.memory}</div>}</span></td>
              <td style={{ color: 'red' }}>{item.product.price.toLocaleString()} đ</td>
              <td>
                <input type="number" min="1" value={item.quantity} onChange={(e) => updateCart(item, parseInt(e.target.value) || 1)} style={{ width: '50px', textAlign: 'center' }}/>
              </td>
              <td style={{ fontWeight: 'bold' }}>{(item.product.price * item.quantity).toLocaleString()} đ</td>
              <td><button onClick={() => removeFromCart(item)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '5px' }}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TỔNG TIỀN VÀ NÚT CHỐT ĐƠN */}
      {!isCheckout ? (
        <div style={{ textAlign: 'right', marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          <h2>TỔNG TIỀN: <span style={{ color: 'red' }}>{total.toLocaleString()} VNĐ</span></h2>
          <button onClick={btnCheckoutClick} style={{ padding: '15px 40px', backgroundColor: '#28a745', color: 'white', border: 'none', fontSize: '18px', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            💳 TIẾN HÀNH CHỐT ĐƠN
          </button>
        </div>
      ) : (
        /* FORM THANH TOÁN (Chỉ hiện khi đã bấm nút trên) */
        <div style={{ marginTop: '30px', padding: '30px', backgroundColor: '#fff', border: '2px solid #28a745', borderRadius: '10px' }}>
          <h2 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>THÔNG TIN GIAO HÀNG</h2>
          <form onSubmit={submitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            
            <div>
              <strong>Tên người nhận: </strong>
              <input type="text" value={customer?.name} disabled style={{ width: '100%', padding: '10px', backgroundColor: '#e9ecef', border: '1px solid #ccc' }} />
            </div>

            <div>
              <strong>Số điện thoại liên hệ (*): </strong>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="VD: 0901234567" style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }} />
            </div>

            <div>
              <strong>Địa chỉ giao hàng chi tiết (*): </strong>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..." style={{ width: '100%', padding: '10px', height: '80px', border: '1px solid #ccc' }} />
            </div>

            <div>
              <strong>Phương thức thanh toán: </strong>
              <div style={{ marginTop: '10px' }}>
                <label style={{ marginRight: '20px', cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} /> Thanh toán khi nhận hàng (COD)
                </label>
                <label style={{ cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="BANKING" checked={paymentMethod === 'BANKING'} onChange={(e) => setPaymentMethod(e.target.value)} /> Chuyển khoản ngân hàng
                </label>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <h2 style={{ marginBottom: '15px' }}>SỐ TIỀN CẦN THANH TOÁN: <span style={{ color: 'red' }}>{total.toLocaleString()} VNĐ</span></h2>
              <button type="button" onClick={() => setIsCheckout(false)} style={{ padding: '15px 30px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '15px', fontSize: '16px' }}>HỦY BỎ</button>
              <button type="submit" style={{ padding: '15px 40px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>✅ XÁC NHẬN ĐẶT HÀNG</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Cart;