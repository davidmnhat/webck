import React, { useState } from 'react';
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdHeadsetMic, MdEmail, MdAccessTime, MdLocationOn } from "react-icons/md";
import { BsShieldFillCheck } from "react-icons/bs";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { FaApple, FaGooglePlay, FaCreditCard, FaUniversity } from "react-icons/fa";
import { FaWallet, FaBolt } from "react-icons/fa";
import { FaBoxOpen, FaGift } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <footer style={{ backgroundColor: '#f5f5f5', borderTop: '1px solid #ddd', marginTop: '40px', padding: '40px 60px', fontSize: '14px', color: '#333' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* CỘT 1 */}
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>Tổng đài hỗ trợ miễn phí</p>
          <p>Mua hàng - bảo hành <strong>1800.000</strong> (7h30 - 22h00)</p>
          <p>Khiếu nại <strong>1800.0001</strong> (8h00 - 21h30)</p>

          <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '20px 0 10px' }}>Phương thức thanh toán</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {[
              { icon: <FaCreditCard />, label: 'Visa' },
                { icon: <FaUniversity />, label: 'ATM' },
                { icon: <FaWallet color="#ae2070" />, label: 'Momo' },
                { icon: <FaBolt color="#0068ff" />, label: 'ZaloPay' },
                { icon: <FaCreditCard color="#0066cc" />, label: 'VNPay' },
                { icon: <FaApple />, label: 'ApplePay' },
            ].map(method => (
              <span key={method.label} style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '4px 10px', backgroundColor: 'white', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {method.icon} {method.label}
              </span>
            ))}
          </div>

          <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '5px', color: '#ff4d4f' }}>ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI</p>
          <p style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaGift /> Nhận ngay voucher 10%
          </p>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '10px' }}>Voucher sẽ được gửi sau 24h, chỉ áp dụng cho khách hàng mới</p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '8px', boxSizing: 'border-box' }}
          />
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại của bạn"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '8px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <input type="checkbox" id="agree" defaultChecked />
            <label htmlFor="agree" style={{ fontSize: '13px', color: '#555' }}>Tôi đồng ý với điều khoản của My Shop</label>
          </div>
          <button
            onClick={() => { if (email && phone) { alert('Đăng ký thành công! 🎉'); setEmail(''); setPhone(''); } else alert('Vui lòng nhập đầy đủ thông tin!'); }}
            style={{ width: '100%', padding: '10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
          >
            ĐĂNG KÝ NGAY
          </button>
        </div>

        {/* CỘT 2 */}
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Thông tin và chính sách</p>
          {[
            'Mua hàng và thanh toán Online',
            'Mua hàng trả góp Online',
            'Chính sách giao hàng',
            'Chính sách đổi trả',
            'Chính sách bảo mật thông tin',
            'Chính sách bảo hành',
            'Tra cứu hoá đơn điện tử',
            'Thông tin hoá đơn mua hàng',
            'Trung tâm bảo hành chính hãng',
            'Quy định về việc sao lưu dữ liệu',
          ].map(item => (
            <p key={item} style={{ marginBottom: '8px', cursor: 'pointer', color: '#444' }}
              onMouseEnter={e => e.target.style.color = '#ff4d4f'}
              onMouseLeave={e => e.target.style.color = '#444'}
            >{item}</p>
          ))}
        </div>

        {/* CỘT 3 */}
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Dịch vụ và thông tin khác</p>
          {[
            'Khách hàng doanh nghiệp (B2B)',
            'Ưu đãi thanh toán',
            'Quy chế hoạt động',
            'Liên hệ hợp tác kinh doanh',
            'Tuyển dụng',
            'Dịch vụ bảo hành mở rộng',
          ].map(item => (
            <p key={item} style={{ marginBottom: '8px', cursor: 'pointer', color: '#444' }}
              onMouseEnter={e => e.target.style.color = '#ff4d4f'}
              onMouseLeave={e => e.target.style.color = '#444'}
            >{item}</p>
          ))}

          <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '20px 0 10px' }}>Mua sắm dễ dàng hơn với App</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#000', color: 'white', padding: '10px 15px', borderRadius: '8px', textDecoration: 'none' }}>
              <FaApple style={{ fontSize: '24px' }} />
              <div><div style={{ fontSize: '11px' }}>Tải trên</div><div style={{ fontWeight: 'bold' }}>App Store</div></div>
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#000', color: 'white', padding: '10px 15px', borderRadius: '8px', textDecoration: 'none' }}>
              <FaGooglePlay style={{ fontSize: '22px' }} />
              <div><div style={{ fontSize: '11px' }}>Tải trên</div><div style={{ fontWeight: 'bold' }}>Google Play</div></div>
            </a>
          </div>
        </div>

        {/* CỘT 4 */}
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Kết nối với My Shop</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {[
              { icon: <FaYoutube />, label: 'YouTube', color: '#FF0000' },
              { icon: <FaFacebookF />, label: 'Facebook', color: '#1877F2' },
              { icon: <FaInstagram />, label: 'Instagram', color: '#E4405F' },
              { icon: <FaTiktok />, label: 'TikTok', color: '#000' },
            ].map(social => (
              <div key={social.label} title={social.label}
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: social.color, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: '18px' }}
              >
                {social.icon}
              </div>
            ))}
          </div>

          <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '10px' }}>Hỗ trợ khách hàng</p>
          {[
            { icon: <MdHeadsetMic color="#ff4d4f" />, text: 'Hotline: 1800.0002' },
            { icon: <MdEmail color="#ff4d4f" />, text: 'Email: support@myshop.vn' },
            { icon: <MdAccessTime color="#ff4d4f" />, text: 'Thứ 2 - CN: 7h30 - 22h00' },
            { icon: <MdLocationOn color="#ff4d4f" />, text: 'Toàn quốc' },
          ].map(item => (
            <p key={item.text} style={{ marginBottom: '8px', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.icon} {item.text}
            </p>
          ))}

          <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '20px 0 10px' }}>Chứng nhận</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '8px 12px', backgroundColor: 'white', fontSize: '12px', textAlign: 'center' }}>
              <BsShieldFillCheck style={{ fontSize: '24px', color: '#28a745' }} />
              <div>Đã đăng ký<br />Bộ Công Thương</div>
            </div>
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '8px 12px', backgroundColor: 'white', fontSize: '12px', textAlign: 'center' }}>
              <AiFillSafetyCertificate style={{ fontSize: '24px', color: '#007bff' }} />
              <div>Bảo mật<br />SSL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: '1px solid #ddd', marginTop: '30px', paddingTop: '20px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
        © 2026 My Shop. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;