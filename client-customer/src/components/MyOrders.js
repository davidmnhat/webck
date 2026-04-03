import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import MyContext from '../contexts/MyContext';

const CANCEL_REASONS = [
  'Tôi muốn thay đổi sản phẩm / số lượng',
  'Tôi tìm được nơi mua rẻ hơn',
  'Tôi đặt nhầm sản phẩm',
  'Thời gian giao hàng quá lâu',
  'Lý do khác',
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { customer } = useContext(MyContext);

  // Modal state
  const [modalOrder, setModalOrder] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (customer) fetchOrders();
  }, [customer]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/order/customer');
      const raw = res.data.orders ?? res.data;
      setOrders(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error('Lỗi lấy đơn hàng', err);
    }
  };

  const openCancelModal = (order) => {
    setModalOrder(order);
    setSelectedReason('');
  };

  const closeCancelModal = () => {
    setModalOrder(null);
    setSelectedReason('');
  };

  const submitCancel = async () => {
    if (!selectedReason) return;
    setCancelling(true);
    try {
      const res = await api.put(`/order/cancel/${modalOrder._id}`, { reason: selectedReason });
      if (res.data.success) {
        setOrders(prev => prev.filter(o => o._id !== modalOrder._id));
        closeCancelModal();
      } else {
        alert(res.data.message || 'Không thể hủy đơn hàng.');
      }
    } catch {
      alert('Lỗi kết nối, vui lòng thử lại.');
    }
    setCancelling(false);
  };

  // Làm cho cái Badge nhìn giống xài thư viện Ant Design / Bootstrap
  const getStatusBadge = (status) => {
    const map = {
      PENDING:   { bg: '#fffbe6', color: '#d48806', border: '#ffe58f', label: 'Chờ xác nhận', dot: '#faad14' },
      APPROVED:  { bg: '#e6f7ff', color: '#0958d9', border: '#91caff', label: 'Đang chuẩn bị', dot: '#1677ff' },
      SHIPPING:  { bg: '#fff2e8', color: '#d4380d', border: '#ffbb96', label: 'Đang giao hàng', dot: '#fa541c' },
      COMPLETED: { bg: '#f6ffed', color: '#389e0d', border: '#b7eb8f', label: 'Giao thành công', dot: '#52c41a' },
      CANCELED:  { bg: '#fff1f0', color: '#cf1322', border: '#ffa39e', label: 'Đã hủy', dot: '#f5222d' },
    };
    const s = map[status] || { bg: '#f5f5f5', color: '#595959', border: '#d9d9d9', label: status, dot: '#bfbfbf' };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
        {s.label}
      </span>
    );
  };

  if (!customer) return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif', color: '#8c8c8c' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
      <h2>Vui lòng đăng nhập để xem đơn hàng</h2>
    </div>
  );

  return (
    <>
      <style>{`
        .mo-wrapper {
          background-color: #f0f2f5;
          min-height: 100vh;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .mo-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .mo-page-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f1f1f;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mo-count-badge {
          background: #1890ff;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 2px 12px;
          border-radius: 20px;
        }

        /* CARD ĐƠN HÀNG STYLE SINH VIÊN NĂM CUỐI */
        .order-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
        }
        
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .order-header {
          padding: 16px 24px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fafafa;
        }

        .order-id-text {
          font-size: 15px;
          color: #595959;
        }

        .order-id-text strong {
          color: #262626;
          font-size: 16px;
          letter-spacing: 0.5px;
        }

        .order-body {
          padding: 24px;
        }

        /* KHUNG THÔNG TIN GIAO HÀNG */
        .order-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #f8f9fa;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #f0f0f0;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #434343;
        }

        .info-item i {
          font-size: 16px;
        }

        /* DANH SÁCH SẢN PHẨM */
        .product-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px dashed #e8e8e8;
        }

        .product-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .product-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
          padding: 4px;
          background: #fff;
        }

        .product-details {
          flex: 1;
        }

        .product-name {
          font-size: 15px;
          font-weight: 600;
          color: #262626;
          margin-bottom: 4px;
        }

        .product-qty {
          font-size: 13px;
          color: #8c8c8c;
        }

        .product-price {
          font-size: 15px;
          font-weight: 600;
          color: #f5222d;
        }

        /* FOOTER ĐƠN HÀNG */
        .order-footer {
          padding-top: 20px;
          margin-top: 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .total-label {
          font-size: 14px;
          color: #595959;
        }

        .total-amount {
          font-size: 20px;
          font-weight: 700;
          color: #f5222d;
        }

        .btn-cancel {
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #ffa39e;
          background: #fff1f0;
          color: #cf1322;
          transition: all 0.3s;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #ffccc7;
          border-color: #ff7875;
        }

        .btn-cancel:disabled {
          background: #f5f5f5;
          border-color: #d9d9d9;
          color: #bfbfbf;
          cursor: not-allowed;
        }

        /* MODAL HỦY ĐƠN */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: #fff;
          width: 90%;
          max-width: 480px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: #262626;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          font-size: 20px;
          color: #8c8c8c;
          cursor: pointer;
          transition: color 0.2s;
        }

        .modal-close-btn:hover { color: #f5222d; }

        .modal-body {
          padding: 24px;
        }

        .reason-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: #434343;
        }

        .reason-box:hover {
          border-color: #1890ff;
        }

        .reason-box.active {
          border-color: #1890ff;
          background: #e6f7ff;
          color: #0958d9;
          font-weight: 500;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #fafafa;
        }

        .btn-modal-close {
          padding: 8px 20px;
          border-radius: 6px;
          border: 1px solid #d9d9d9;
          background: #fff;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-modal-close:hover {
          color: #1890ff;
          border-color: #1890ff;
        }

        .btn-modal-submit {
          padding: 8px 24px;
          border-radius: 6px;
          border: none;
          background: #f5222d;
          color: #fff;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-modal-submit:hover:not(:disabled) {
          background: #cf1322;
        }

        .btn-modal-submit:disabled {
          background: #ffccc7;
          cursor: not-allowed;
        }

        /* EMPTY STATE */
        .empty-container {
          text-align: center;
          padding: 80px 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
      `}</style>

      <div className="mo-wrapper">
        <div className="mo-container">
          <div className="mo-page-title">
            📦 Quản lý đơn hàng
            <span className="mo-count-badge">{orders.length}</span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-container">
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
              <h3 style={{ color: '#595959' }}>Bạn chưa có đơn hàng nào</h3>
              <p style={{ color: '#8c8c8c' }}>Hãy khám phá các sản phẩm và đặt hàng ngay nhé!</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                
                {/* HEADER */}
                <div className="order-header">
                  <div className="order-id-text">
                    Mã đơn: <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="order-body">
                  {/* META INFO GRID */}
                  <div className="order-info-grid">
                    <div className="info-item">
                      <span>🕒 <strong>Ngày đặt:</strong> {new Date(order.cdate).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="info-item">
                      <span>💳 <strong>Thanh toán:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản / Quẹt thẻ'}</span>
                    </div>
                    <div className="info-item">
                      <span>📞 <strong>SĐT:</strong> {order.phone}</span>
                    </div>
                    <div className="info-item">
                      <span>📍 <strong>Giao đến:</strong> {order.address}</span>
                    </div>
                  </div>

                  {/* PRODUCT LIST */}
                  <div className="product-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="product-item">
                        <img src={item.product?.image} alt={item.product?.name} className="product-img" />
                        <div className="product-details">
                          <div className="product-name">{item.product?.name}</div>
                          <div className="product-qty">Số lượng: x{item.quantity}</div>
                        </div>
                        <div className="product-price">
                          {(item.product?.price * item.quantity).toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="order-footer">
                    <button
                      className="btn-cancel"
                      disabled={order.status !== 'PENDING'}
                      onClick={() => openCancelModal(order)}
                      title={order.status !== 'PENDING' ? 'Chỉ có thể hủy khi đơn đang chờ xác nhận' : 'Hủy đơn này'}
                    >
                      {order.status !== 'PENDING' ? 'Không thể hủy' : 'Yêu cầu hủy đơn'}
                    </button>
                    
                    <div className="total-section">
                      <span className="total-label">Tổng tiền:</span>
                      <span className="total-amount">{order.total.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL HỦY ĐƠN HÀNG */}
      {modalOrder && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hủy đơn hàng #{modalOrder._id.slice(-8).toUpperCase()}</h3>
              <button className="modal-close-btn" onClick={closeCancelModal}>✕</button>
            </div>

            <div className="modal-body">
              <p style={{ color: '#595959', marginBottom: '16px' }}>
                Vui lòng chọn lý do bạn muốn hủy đơn hàng này:
              </p>
              {CANCEL_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`reason-box ${selectedReason === reason ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    style={{ cursor: 'pointer', accentColor: '#1890ff' }}
                  />
                  {reason}
                </label>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" onClick={closeCancelModal}>Quay lại</button>
              <button
                className="btn-modal-submit"
                disabled={!selectedReason || cancelling}
                onClick={submitCancel}
              >
                {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;