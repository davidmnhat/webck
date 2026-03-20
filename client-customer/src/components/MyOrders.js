import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import MyContext from '../contexts/MyContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { customer } = useContext(MyContext);

  useEffect(() => {
    if (customer) {
      const fetchOrders = async () => {
        try {
          const res = await api.get('/order/customer');
          console.log('Orders data:', res.data); // Xem structure thực tế
          setOrders(res.data.orders || res.data.data || res.data || []);
        } catch (err) {
          console.error("Lỗi lấy đơn hàng", err);
        }
      };
      fetchOrders();
    }
  }, [customer]);

  // Hàm dịch trạng thái sang tiếng Việt và tô màu (Badge)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span style={{ backgroundColor: '#ffc107', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>🟡 Chờ xác nhận</span>;
      case 'APPROVED': return <span style={{ backgroundColor: '#17a2b8', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>🔵 Đang chuẩn bị</span>;
      case 'SHIPPING': return <span style={{ backgroundColor: '#fd7e14', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>🟠 Đang giao hàng</span>;
      case 'COMPLETED': return <span style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>🟢 Giao thành công</span>;
      case 'CANCELED': return <span style={{ backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>🔴 Đã hủy</span>;
      default: return <span>{status}</span>;
    }
  };

  if (!customer) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Vui lòng đăng nhập để xem đơn hàng!</h2>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#ff4d4f' }}>📦 ĐƠN HÀNG CỦA TÔI</h2>
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Bạn chưa đặt đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', marginBottom: '25px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            {/* Header đơn hàng: Mã đơn + Trạng thái */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <strong style={{ fontSize: '16px' }}>Mã đơn: #{order._id.slice(-6).toUpperCase()}</strong>
              <div>{getStatusBadge(order.status)}</div>
            </div>
            
            {/* Thông tin giao hàng */}
            <div style={{ fontSize: '15px', color: '#555', marginBottom: '15px' }}>
              <p>🕒 <strong>Ngày đặt:</strong> {new Date(order.cdate).toLocaleString()}</p>
              <p>📍 <strong>Giao đến:</strong> {order.address} ({order.phone})</p>
              <p>💳 <strong>Thanh toán:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
            </div>

            {/* Danh sách sản phẩm trong đơn */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px dashed #eee' }}>
                    <td style={{ padding: '10px 0' }}><img src={item.product?.image} width="60" alt="sp" style={{ borderRadius: '5px', border: '1px solid #ddd' }} /></td>
                    <td style={{ width: '50%' }}><strong>{item.product?.name}</strong></td>
                    <td>Số lượng: x{item.quantity}</td>
                    <td style={{ textAlign: 'right', color: 'red', fontWeight: 'bold' }}>{(item.product?.price * item.quantity).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Tổng tiền */}
            <h3 style={{ textAlign: 'right', marginTop: '20px', color: '#ff4d4f' }}>
              TỔNG TIỀN: {order.total.toLocaleString()} VNĐ
            </h3>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;