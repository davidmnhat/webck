import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      // Đảm bảo dữ liệu trả về phải là 1 mảng (Array)
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Lỗi tải đơn hàng', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    if (window.confirm(`Xác nhận chuyển đơn hàng này sang trạng thái: ${newStatus}?`)) {
      try {
        const res = await api.put(`/admin/orders/status/${id}`, { status: newStatus });
        if (res.data) {
          alert('Cập nhật thành công!');
          fetchOrders(); 
        }
      } catch (err) {
        alert('Lỗi cập nhật!');
      }
    }
  };

  return (
    <div className="align-center">
      <h2 className="text-center">QUẢN LÝ ĐƠN HÀNG</h2>
      <table className="datatable" border="1" width="100%">
        <tbody>
          <tr className="datatable" style={{ backgroundColor: '#f4f4f4' }}>
            <th>Mã đơn</th>
            <th>Ngày đặt</th>
            <th>Khách hàng</th>
            <th>SĐT / Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái hiện tại</th>
            <th>Hành động (Duyệt đơn)</th>
          </tr>
          
          {/* Kiểm tra nếu có dữ liệu mới dùng .map để vẽ */}
          {orders && orders.length > 0 ? (
            orders.map((item) => (
              <tr key={item._id} className="datatable" style={{ textAlign: 'center' }}>
                {/* Dùng toán tử 3 ngôi ( ? : ) để kiểm tra, nếu thiếu dữ liệu thì in ra 'N/A' hoặc '0' */}
                <td>{item._id ? item._id.slice(-6).toUpperCase() : 'N/A'}</td>
                <td>{item.cdate ? new Date(item.cdate).toLocaleString() : 'N/A'}</td>
                <td>{item.customer?.name || 'Khách ẩn danh'}</td>
                <td>{item.phone || 'N/A'} <br/> {item.address || 'N/A'}</td>
                <td style={{ color: 'red', fontWeight: 'bold' }}>
                  {item.total ? item.total.toLocaleString() : '0'} đ
                </td>
                <td><strong>{item.status || 'PENDING'}</strong></td>
                <td>
                  {item.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(item._id, 'APPROVED')} style={{ background: '#17a2b8', color: 'white', padding: '5px', margin: '2px', cursor: 'pointer', border: 'none' }}>Duyệt đơn</button>
                      <button onClick={() => updateStatus(item._id, 'CANCELED')} style={{ background: '#dc3545', color: 'white', padding: '5px', margin: '2px', cursor: 'pointer', border: 'none' }}>Hủy đơn</button>
                    </>
                  )}
                  {item.status === 'APPROVED' && (
                    <button onClick={() => updateStatus(item._id, 'SHIPPING')} style={{ background: '#fd7e14', color: 'white', padding: '5px', cursor: 'pointer', border: 'none' }}>Giao cho Shipper</button>
                  )}
                  {item.status === 'SHIPPING' && (
                    <button onClick={() => updateStatus(item._id, 'COMPLETED')} style={{ background: '#28a745', color: 'white', padding: '5px', cursor: 'pointer', border: 'none' }}>Đã giao xong</button>
                  )}
                  {item.status === 'COMPLETED' && <span style={{ color: 'green', fontWeight: 'bold' }}>Hoàn tất ✔️</span>}
                  {item.status === 'CANCELED' && <span style={{ color: 'red', fontWeight: 'bold' }}>Đã hủy ❌</span>}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                Chưa có đơn hàng nào hoặc đang tải dữ liệu...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Order;