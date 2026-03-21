// components/BankingModal.jsx
import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';

// ====== CẤU HÌNH NGÂN HÀNG CỦA MÀY ======
const BANK_ID = 'MB';                        // MB Bank
const ACCOUNT_NO = '013333181005';             // ← Số tài khoản của mày
const ACCOUNT_NAME = 'VO MINH NHAT';         // ← Tên chủ tài khoản (viết hoa không dấu)
// =========================================

const POLL_INTERVAL = 5000; // kiểm tra mỗi 5 giây
const TIMEOUT = 10 * 60 * 1000; // hết hạn sau 10 phút

const BankingModal = ({ total, orderCode, onSuccess, onClose }) => {
  const [status, setStatus] = useState('waiting'); // 'waiting' | 'success' | 'timeout'
  const [timeLeft, setTimeLeft] = useState(TIMEOUT / 1000);
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  const addInfo = `THANHTOAN ${orderCode}`;
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png`
    + `?amount=${total}`
    + `&addInfo=${encodeURIComponent(addInfo)}`
    + `&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // Polling kiểm tra thanh toán
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/payment/check-payment/${orderCode}`);
        if (res.data.paid) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setStatus('success');
          setTimeout(onSuccess, 2000); // đợi 2s cho user thấy tick rồi chuyển trang
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, POLL_INTERVAL);

    // Đếm ngược timeout
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setStatus('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, [orderCode]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; backdrop-filter: blur(3px);
        }
        .modal-box {
          background: #fff; border-radius: 18px; width: 420px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
          overflow: hidden; animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .modal-header {
          background: #003087; color: #fff;
          padding: 16px 20px; display: flex;
          align-items: center; justify-content: space-between;
        }
        .modal-header h3 { font-size: 15px; font-weight: 600; margin: 0; }
        .modal-close {
          background: none; border: none; color: #fff;
          font-size: 20px; cursor: pointer; line-height: 1; padding: 0;
        }
        .modal-body { padding: 24px; text-align: center; }

        .qr-wrapper {
          position: relative; display: inline-block;
          border: 2px solid #e8e6e1; border-radius: 12px;
          overflow: hidden; margin-bottom: 16px;
        }
        .qr-wrapper img { display: block; width: 220px; height: 220px; object-fit: contain; }

        /* Overlay tick khi success */
        .qr-success-overlay {
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.92);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .qr-success-overlay .tick { font-size: 64px; animation: pop 0.4s ease; }
        @keyframes pop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .qr-success-overlay p { font-weight: 600; color: #16a34a; margin-top: 8px; font-size: 14px; }

        .bank-info {
          background: #f5f4f0; border-radius: 10px;
          padding: 14px 16px; text-align: left; margin-bottom: 14px;
          font-size: 13.5px; line-height: 2;
        }
        .bank-info .label { color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
        .bank-info .value { color: #111; font-weight: 600; }
        .bank-info .value.amount { color: #e53935; font-size: 16px; font-family: 'DM Mono', monospace; }

        .copy-btn {
          background: none; border: 1px solid #ddd; border-radius: 6px;
          padding: 2px 8px; font-size: 11px; cursor: pointer; margin-left: 6px;
          color: #555; vertical-align: middle;
        }
        .copy-btn:hover { background: #f0f0f0; }

        .timer {
          font-size: 12px; color: #aaa; margin-top: 6px;
        }
        .timer span { font-family: 'DM Mono', monospace; color: #e53935; font-weight: 600; }

        .status-waiting { color: #888; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .dot-pulse { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; animation: pulse 1.2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

        .timeout-box { color: #ef4444; font-size: 13.5px; padding: 12px; background: #fef2f2; border-radius: 10px; margin-top: 10px; }
      `}</style>

      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">
          <div className="modal-header">
            <h3>🏦 Thanh toán chuyển khoản MB Bank</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>

          <div className="modal-body">
            {/* QR CODE */}
            <div className="qr-wrapper">
              <img src={qrUrl} alt="QR thanh toán" />
              {status === 'success' && (
                <div className="qr-success-overlay">
                  <div className="tick">✅</div>
                  <p>Thanh toán thành công!</p>
                </div>
              )}
            </div>

            {/* THÔNG TIN CHUYỂN KHOẢN */}
            <div className="bank-info">
              <div><span className="label">Ngân hàng</span><br/><span className="value">MB Bank (MBBank)</span></div>
              <div><span className="label">Số tài khoản</span><br/>
                <span className="value">{ACCOUNT_NO}</span>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(ACCOUNT_NO)}>Copy</button>
              </div>
              <div><span className="label">Chủ tài khoản</span><br/><span className="value">{ACCOUNT_NAME}</span></div>
              <div><span className="label">Số tiền</span><br/>
                <span className="value amount">{total.toLocaleString('vi-VN')}₫</span>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(String(total))}>Copy</button>
              </div>
              <div><span className="label">Nội dung CK</span><br/>
                <span className="value">{addInfo}</span>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(addInfo)}>Copy</button>
              </div>
            </div>

            {/* TRẠNG THÁI */}
            {status === 'waiting' && (
              <>
                <div className="status-waiting">
                  <div className="dot-pulse" />
                  Đang chờ xác nhận thanh toán...
                </div>
                <div className="timer">
                  Hết hạn sau <span>{formatTime(timeLeft)}</span>
                </div>
              </>
            )}

            {status === 'timeout' && (
              <div className="timeout-box">
                ⏱️ Hết thời gian chờ. Vui lòng đặt lại đơn hoặc chọn thanh toán COD.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BankingModal;