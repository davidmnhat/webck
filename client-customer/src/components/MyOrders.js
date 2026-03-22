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
  const [modalOrder, setModalOrder] = useState(null); // đơn đang muốn hủy
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

  const getStatusBadge = (status) => {
    const map = {
      PENDING:   { bg: '#fef9c3', color: '#92400e', border: '#fde68a', label: 'Chờ xác nhận', dot: '#f59e0b' },
      APPROVED:  { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe', label: 'Đang chuẩn bị', dot: '#3b82f6' },
      SHIPPING:  { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa', label: 'Đang giao hàng', dot: '#f97316' },
      COMPLETED: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0', label: 'Giao thành công', dot: '#22c55e' },
      CANCELED:  { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', label: 'Đã hủy', dot: '#ef4444' },
    };
    const s = map[status] || { bg: '#f3f4f6', color: '#555', border: '#e5e7eb', label: status, dot: '#aaa' };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: s.bg, color: s.color,
        border: `1px solid ${s.border}`,
        padding: '4px 12px', borderRadius: 20,
        fontSize: 12, fontWeight: 600,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
        {s.label}
      </span>
    );
  };

  if (!customer) return (
    <div style={{ textAlign: 'center', marginTop: 80, fontFamily: 'sans-serif', color: '#555' }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <h2 style={{ marginTop: 16 }}>Vui lòng đăng nhập để xem đơn hàng</h2>
    </div>
  );

  return (
    <>
      <style>{`
        

        .mo-root {
          font-family: Arial, Helvetica, sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
          padding: 32px;
          color: #1a1a1a;
        }

        .mo-title {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.3px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mo-title .badge {
          background: #111;
          color: #f5f4f0;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .order-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .order-card-header {
          padding: 16px 24px;
          border-bottom: 1px solid #f0eeea;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #faf9f7;
          flex-wrap: wrap;
          gap: 10px;
        }

        .order-id {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          color: #555;
        }

        .order-id strong {
          color: #111;
          font-size: 14px;
        }

        .order-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-cancel-order {
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid #ef4444;
          background: none;
          color: #ef4444;
          transition: all 0.15s;
        }

        .btn-cancel-order:hover:not(:disabled) {
          background: #fef2f2;
        }

        .btn-cancel-order:disabled {
          border-color: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
          background: none;
        }

        .order-meta {
          padding: 16px 24px;
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          font-size: 13.5px;
          color: #666;
          border-bottom: 1px solid #f0eeea;
        }

        .order-meta span { display: flex; align-items: center; gap: 6px; }

        .order-items { padding: 0 24px; }

        .order-item-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px dashed #f0eeea;
        }

        .order-item-row:last-child { border-bottom: none; }

        .order-item-row img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e8e6e1;
          flex-shrink: 0;
        }

        .order-item-name {
          flex: 1;
          font-weight: 500;
          font-size: 13.5px;
        }

        .order-item-qty {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #888;
          white-space: nowrap;
        }

        .order-item-price {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: #e53935;
          font-weight: 500;
          white-space: nowrap;
        }

        .order-footer {
          padding: 14px 24px;
          border-top: 1px solid #f0eeea;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          background: #faf9f7;
        }

        .order-total-label { font-size: 13px; color: #888; }

        .order-total-amount {
          font-family: 'DM Mono', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #e53935;
        }

        /* MODAL */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal-box {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e8e6e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          font-size: 15px;
          font-weight: 600;
          color: #111;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #aaa;
          line-height: 1;
          padding: 2px 6px;
          border-radius: 6px;
          transition: all 0.15s;
        }

        .modal-close:hover { background: #f5f4f0; color: #555; }

        .modal-order-ref {
          padding: 12px 24px;
          background: #faf9f7;
          border-bottom: 1px solid #e8e6e1;
          font-size: 12px;
          color: #888;
        }

        .modal-order-ref strong {
          font-family: 'DM Mono', monospace;
          color: #555;
        }

        .modal-body { padding: 20px 24px; }

        .modal-body p {
          font-size: 13.5px;
          color: #555;
          margin-bottom: 14px;
        }

        .reason-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border: 1.5px solid #e0ddd8;
          border-radius: 9px;
          margin-bottom: 8px;
          cursor: pointer;
          font-size: 13.5px;
          color: #444;
          transition: all 0.15s;
          background: #faf9f7;
        }

        .reason-option:hover { border-color: #2563eb; background: #f0f7ff; }

        .reason-option.selected {
          border-color: #2563eb;
          background: #f0f7ff;
          color: #1d4ed8;
          font-weight: 500;
        }

        .reason-option input { accent-color: #2563eb; width: 15px; height: 15px; cursor: pointer; }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e8e6e1;
          display: flex;
          gap: 10px;
        }

        .btn-modal-cancel {
          flex: 1;
          padding: 10px;
          border-radius: 9px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          background: none;
          border: 1px solid #e0ddd8;
          color: #666;
          transition: all 0.15s;
        }

        .btn-modal-cancel:hover { background: #f5f4f0; }

        .btn-modal-confirm {
          flex: 1;
          padding: 10px;
          border-radius: 9px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          background: #ef4444;
          color: #fff;
          border: none;
          transition: all 0.15s;
        }

        .btn-modal-confirm:hover:not(:disabled) { background: #dc2626; }

        .btn-modal-confirm:disabled {
          background: #e0ddd8;
          color: #aaa;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          color: #aaa;
          font-size: 15px;
        }

        .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
      `}</style>

      <div className="mo-root">
        <div className="mo-title">
          📦 Đơn hàng của tôi
          <span className="badge">{orders.length} đơn</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛍️</div>
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Header */}
              <div className="order-card-header">
                <div className="order-id">
                  Đơn hàng <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                </div>
                <div className="order-header-right">
                  {getStatusBadge(order.status)}
                  <button
                    className="btn-cancel-order"
                    disabled={order.status !== 'PENDING'}
                    onClick={() => openCancelModal(order)}
                    title={order.status !== 'PENDING' ? 'Chỉ có thể hủy đơn đang chờ xác nhận' : 'Hủy đơn hàng'}
                  >
                    Hủy đơn
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="order-meta">
                <span>🕒 {new Date(order.cdate).toLocaleString('vi-VN')}</span>
                <span>📍 {order.address}</span>
                <span>📞 {order.phone}</span>
                <span>💳 {order.paymentMethod === 'COD' ? 'COD' : 'Chuyển khoản'}</span>
              </div>

              {/* Items */}
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <img src={item.product?.image} alt={item.product?.name} />
                    <div className="order-item-name">{item.product?.name}</div>
                    <div className="order-item-qty">x{item.quantity}</div>
                    <div className="order-item-price">
                      {(item.product?.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="order-footer">
                <span className="order-total-label">Tổng thanh toán</span>
                <span className="order-total-amount">{order.total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CANCEL MODAL */}
      {modalOrder && (
        <div className="modal-backdrop" onClick={closeCancelModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Lý do hủy đơn hàng</h3>
              <button className="modal-close" onClick={closeCancelModal}>✕</button>
            </div>

            <div className="modal-order-ref">
              Đơn hàng <strong>#{modalOrder._id.slice(-6).toUpperCase()}</strong>
            </div>

            <div className="modal-body">
              <p>Vui lòng cho chúng tôi biết lý do bạn muốn hủy:</p>
              {CANCEL_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`reason-option ${selectedReason === reason ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                  />
                  {reason}
                </label>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={closeCancelModal}>Giữ đơn hàng</button>
              <button
                className="btn-modal-confirm"
                disabled={!selectedReason || cancelling}
                onClick={submitCancel}
              >
                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;