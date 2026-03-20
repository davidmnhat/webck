import React, { useState, useContext, useEffect } from 'react';
import MyContext from '../contexts/MyContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Cart = () => {
  const { mycart, removeFromCart, updateCart, customer, clearCart } = useContext(MyContext);
  const navigate = useNavigate();

  const [isCheckout, setIsCheckout] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // State lưu danh sách index các sản phẩm được tick — mặc định tick hết
  const [selectedItems, setSelectedItems] = useState([]);

  // Khi giỏ hàng thay đổi, tick hết các item mới
  useEffect(() => {
    setSelectedItems(mycart.map((_, i) => i));
  }, [mycart.length]);

  useEffect(() => {
    if (customer) {
      setPhone(customer.phone);
      if (customer.address) setAddress(customer.address);
    }
  }, [customer]);

  const toggleItem = (index) => {
    setSelectedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === mycart.length) setSelectedItems([]);
    else setSelectedItems(mycart.map((_, i) => i));
  };

  const selectedCart = mycart.filter((_, i) => selectedItems.includes(i));
  const total = selectedCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const btnCheckoutClick = () => {
    if (selectedCart.length === 0) {
      alert('Bạn chưa chọn sản phẩm nào để mua!');
      return;
    }
    if (!customer) {
      alert('Bạn phải đăng nhập mới được đặt hàng!');
      navigate('/login');
      return;
    }
    setIsCheckout(true);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (window.confirm('Bạn có chắc chắn muốn đặt hàng không?')) {
      const items = selectedCart.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));
      const body = { items, total, phone, address, paymentMethod };
      try {
        const res = await api.post('/order/checkout', body);
        if (res.data.success) {
          alert('🎉 Đặt hàng thành công!');
          // Chỉ xóa các sản phẩm đã được tick, giữ lại sản phẩm chưa chọn
          selectedCart.forEach(item => removeFromCart(item));
          navigate('/');
        } else {
          alert(res.data.message);
        }
      } catch {
        alert('Lỗi kết nối Server! Vui lòng thử lại.');
      }
    }
  };

  if (mycart.length === 0) return (
    <div style={{ textAlign: 'center', marginTop: 80, fontFamily: 'sans-serif', color: '#555' }}>
      <div style={{ fontSize: 48 }}>🛒</div>
      <h2 style={{ marginTop: 16 }}>Giỏ hàng trống</h2>
      <p style={{ marginTop: 8 }}>Về trang chủ để tiếp tục mua sắm nhé!</p>
    </div>
  );

  // css
  const allChecked = selectedItems.length === mycart.length;
  const someChecked = selectedItems.length > 0 && !allChecked;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .cart-root {
          font-family: 'DM Sans', sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
          padding: 32px;
          color: #1a1a1a;
        }

        .cart-title {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.3px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }

        /* TABLE */
        .cart-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
        }

        .cart-panel-header {
          padding: 14px 20px;
          border-bottom: 1px solid #e8e6e1;
          background: #faf9f7;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cart-panel-header span {
          font-size: 13px;
          color: #888;
        }

        table.cart-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .cart-table thead th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: #888;
          border-bottom: 1px solid #e8e6e1;
          background: #faf9f7;
          white-space: nowrap;
        }

        .cart-table tbody tr {
          border-bottom: 1px solid #f0eeea;
          transition: background 0.15s;
        }

        .cart-table tbody tr:last-child { border-bottom: none; }
        .cart-table tbody tr:hover { background: #fafaf8; }

        .cart-table tbody tr.row-selected { background: #f0f7ff; }
        .cart-table tbody tr.row-unselected { opacity: 0.45; }

        .cart-table td {
          padding: 12px 16px;
          vertical-align: middle;
          color: #333;
        }

        .cart-table td img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e8e6e1;
        }

        .product-name { font-weight: 500; }
        .product-option { font-size: 12px; color: #888; margin-top: 3px; }

        .price-tag {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: #e53935;
          font-weight: 500;
        }

        .qty-input {
          width: 54px;
          padding: 5px 8px;
          border: 1px solid #e0ddd8;
          border-radius: 7px;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          text-align: center;
          background: #faf9f7;
          outline: none;
        }

        .qty-input:focus { border-color: #2563eb; }

        .btn-remove {
          background: none;
          border: 1px solid #fca5a5;
          color: #ef4444;
          padding: 5px 11px;
          border-radius: 7px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-remove:hover { background: #fef2f2; }

        /* CHECKBOX */
        .custom-check {
          width: 17px;
          height: 17px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        /* SUMMARY PANEL */
        .summary-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
          position: sticky;
          top: 24px;
        }

        .summary-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e8e6e1;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #555;
        }

        .summary-body { padding: 20px; }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          padding: 6px 0;
          color: #555;
        }

        .summary-row.total {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          border-top: 1px solid #e8e6e1;
          margin-top: 10px;
          padding-top: 14px;
        }

        .summary-row.total .amount {
          font-family: 'DM Mono', monospace;
          color: #e53935;
        }

        .btn-checkout {
          width: 100%;
          margin-top: 18px;
          padding: 12px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-checkout:hover { background: #333; }
        .btn-checkout:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .selected-hint {
          text-align: center;
          font-size: 12px;
          color: #aaa;
          margin-top: 10px;
        }

        /* CHECKOUT FORM */
        .checkout-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
          margin-top: 20px;
          grid-column: 1 / -1;
        }

        .checkout-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e8e6e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .checkout-header h2 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #555;
        }

        .checkout-body {
          padding: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group.full { grid-column: 1 / -1; }

        .form-group label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #777;
        }

        .form-group input,
        .form-group textarea {
          padding: 9px 12px;
          border: 1px solid #e0ddd8;
          border-radius: 8px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          background: #faf9f7;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.15s;
        }

        .form-group input:disabled { color: #999; background: #f5f4f0; }
        .form-group input:focus,
        .form-group textarea:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }

        .payment-options { display: flex; gap: 12px; margin-top: 4px; }

        .payment-option {
          flex: 1;
          border: 1.5px solid #e0ddd8;
          border-radius: 9px;
          padding: 12px 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          transition: all 0.15s;
          background: #faf9f7;
        }

        .payment-option.selected {
          border-color: #2563eb;
          background: #f0f7ff;
          color: #2563eb;
          font-weight: 600;
        }

        .payment-option input { display: none; }

        .checkout-footer {
          padding: 16px 24px;
          border-top: 1px solid #e8e6e1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .checkout-total {
          font-size: 15px;
          font-weight: 700;
          margin-right: auto;
        }

        .checkout-total span {
          font-family: 'DM Mono', monospace;
          color: #e53935;
        }

        .btn { padding: 10px 22px; border-radius: 9px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-cancel { background: none; border: 1px solid #e0ddd8; color: #666; }
        .btn-cancel:hover { background: #f5f4f0; }
        .btn-confirm { background: #111; color: #fff; padding: 10px 28px; }
        .btn-confirm:hover { background: #333; }

        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
          .summary-panel { position: static; }
          .checkout-body { grid-template-columns: 1fr; }
          .form-group.full { grid-column: 1; }
        }
      `}</style>

      <div className="cart-root">
        <div className="cart-title">🛒 Giỏ hàng của bạn</div>

        <div className="cart-layout">
          {/* TABLE */}
          <div className="cart-panel">
            <div className="cart-panel-header">
              <input
                type="checkbox"
                className="custom-check"
                checked={allChecked}
                ref={el => { if (el) el.indeterminate = someChecked; }}
                onChange={toggleAll}
              />
              <span>
                {selectedItems.length === 0
                  ? 'Chưa chọn sản phẩm nào'
                  : `Đã chọn ${selectedItems.length} / ${mycart.length} sản phẩm`}
              </span>
            </div>

            <table className="cart-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Hình</th>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mycart.map((item, index) => {
                  const checked = selectedItems.includes(index);
                  return (
                    <tr key={index} className={checked ? 'row-selected' : 'row-unselected'}>
                      <td>
                        <input
                          type="checkbox"
                          className="custom-check"
                          checked={checked}
                          onChange={() => toggleItem(index)}
                        />
                      </td>
                      <td><img src={item.product.image} alt={item.product.name} /></td>
                      <td>
                        <div className="product-name">{item.product.name}</div>
                        <div className="product-option">
                          {item.color && `Màu: ${item.color}`}
                          {item.color && item.memory && ' · '}
                          {item.memory && `Bộ nhớ: ${item.memory}`}
                        </div>
                      </td>
                      <td><span className="price-tag">{item.product.price.toLocaleString('vi-VN')}₫</span></td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          className="qty-input"
                          onChange={(e) => updateCart(item, parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td><span className="price-tag">{(item.product.price * item.quantity).toLocaleString('vi-VN')}₫</span></td>
                      <td>
                        <button className="btn-remove" onClick={() => removeFromCart(item)}>🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* SUMMARY */}
          <div className="summary-panel">
            <div className="summary-header">Tóm tắt đơn hàng</div>
            <div className="summary-body">
              <div className="summary-row">
                <span>Sản phẩm đã chọn</span>
                <span>{selectedItems.length} món</span>
              </div>
              <div className="summary-row">
                <span>Số lượng</span>
                <span>{selectedCart.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Tổng tiền</span>
                <span className="amount">{total.toLocaleString('vi-VN')}₫</span>
              </div>

              <button
                className="btn-checkout"
                onClick={btnCheckoutClick}
                disabled={selectedItems.length === 0}
              >
                Tiến hành đặt hàng →
              </button>

              {selectedItems.length === 0 && (
                <div className="selected-hint">Tick vào sản phẩm để chọn mua</div>
              )}
            </div>
          </div>

          {/* CHECKOUT FORM */}
          {isCheckout && (
            <div className="checkout-panel">
              <div className="checkout-header">
                <h2>Thông tin giao hàng</h2>
                <span style={{ fontSize: 12, color: '#aaa' }}>{selectedCart.length} sản phẩm được chọn</span>
              </div>

              <form onSubmit={submitOrder}>
                <div className="checkout-body">
                  <div className="form-group">
                    <label>Tên người nhận</label>
                    <input type="text" value={customer?.name || ''} disabled />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="VD: 0901234567"
                    />
                  </div>

                  <div className="form-group full">
                    <label>Địa chỉ giao hàng *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    />
                  </div>

                  <div className="form-group full">
                    <label>Phương thức thanh toán</label>
                    <div className="payment-options">
                      {[
                        { value: 'COD', label: '🚚 Thanh toán khi nhận hàng (COD)' },
                        { value: 'BANKING', label: '🏦 Chuyển khoản ngân hàng' },
                      ].map(opt => (
                        <label
                          key={opt.value}
                          className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={opt.value}
                            checked={paymentMethod === opt.value}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="checkout-footer">
                  <div className="checkout-total">
                    Tổng thanh toán: <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <button type="button" className="btn btn-cancel" onClick={() => setIsCheckout(false)}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-confirm">✅ Xác nhận đặt hàng</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;