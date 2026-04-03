import React, { useContext, useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import MyContext from './contexts/MyContext';
import MyOrders from './components/MyOrders';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import MyProfile from './components/MyProfile';
import Footer from './components/Footer';

const CATEGORIES = ['Macbook', 'Điện thoại', 'Máy tính bảng', 'Phụ kiện'];

const PROVINCES = ['Hà Nội', 'Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Huế',
                  'Tuyên Quang', 'Cao Bằng', 'Lai Châu', 'Lào Cai', 'Thái Nguyên', 'Điện Biên', 'Sơn La',
                  'Phú Thọ', 'Vĩnh Phúc', 'Bắc Ninh', 'Hưng Yên', 'Ninh Bình', 'Thanh Hóa', 'Nghệ An',
                  'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Quảng Ngãi', 'Gia Lai', 'Đắk Lắk', 'Khánh Hòa',
                  'Lâm Đồng', 'Đồng Nai', 'Tây Ninh', 'Long An', 'Đồng Tháp', 'An Giang', 'Cà Mau'];

const ProvinceModal = ({ onSelect, onClose, selectedProvince }) => {
  const [search, setSearch] = useState('');

  const filtered = PROVINCES.filter(p =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', width: '500px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Nhập tên tỉnh thành..."
            autoFocus
            style={{ flex: 1, padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none', fontSize: '15px' }}
          />
          <button
            onClick={onClose}
            style={{ padding: '8px 15px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Đóng ✕
          </button>
        </div>

        <p style={{ color: '#888', fontSize: '13px', marginBottom: '10px' }}>
          Vui lòng chọn tỉnh, thành phố để biết chính xác giá, khuyến mãi và tồn kho
        </p>

        <div style={{ overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          {filtered.map(province => (
            <div
              key={province}
              onClick={() => { onSelect(province); onClose(); }}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: selectedProvince === province ? '#fff0f0' : 'white',
                color: selectedProvince === province ? '#ff4d4f' : '#333',
                fontWeight: selectedProvince === province ? 'bold' : 'normal',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedProvince === province ? '#fff0f0' : 'white'}
            >
              {province}
              {selectedProvince === province && <span style={{ color: '#ff4d4f' }}>✔</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header = ({ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) => {
  const { mycart, customer, setCustomer, setToken } = useContext(MyContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('Hồ Chí Minh');
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setCustomer(null);
    setToken('');
    localStorage.removeItem('customer_token');
    alert('Đã đăng xuất!');
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setShowDropdown(false);
    
    // NẾU LÀ "Tất cả sản phẩm" (cat = null) -> Về trang chủ gốc
    if (!cat) {
      navigate('/');
    } 
    // NẾU CÓ CHỌN DANH MỤC -> Gắn thêm đuôi category vào URL để Home.js hiểu
    else {
      navigate(`/?category=${encodeURIComponent(cat)}`);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory(null);
    navigate('/');
  };

  return (
    <>
      {showProvinceModal && (
        <ProvinceModal
          selectedProvince={selectedProvince}
          onSelect={setSelectedProvince}
          onClose={() => setShowProvinceModal(false)}
        />
      )}

      <div style={{ backgroundColor: '#ff4d4f', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
          style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          🛒 MY SHOP
        </Link>

        {/* THANH TÌM KIẾM */}
        <div style={{ flex: 1, margin: '0 20px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm sản phẩm..."
            style={{ width: '95%', padding: '8px 15px', borderRadius: '20px', border: 'none', fontSize: '15px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {customer ? (
            <>
              <span style={{ whiteSpace: 'nowrap' }}>Xin chào, <Link to="/myprofile" style={{ color: 'yellow', textDecoration: 'none' }}>{customer.name}</Link>!</span>
              <span onClick={handleLogout} style={{ cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}>Đăng xuất</span>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}>Đăng nhập</Link> |
              <Link to="/signup" style={{ color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}>Đăng ký</Link>
            </>
          )}

          {/* NÚT DANH MỤC DROPDOWN */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ backgroundColor: 'white', color: '#ff4d4f', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              📂 DANH MỤC {showDropdown ? '▲' : '▼'}
            </button>

            {showDropdown && (
              <div style={{ position: 'absolute', top: '45px', left: '0', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', minWidth: '180px', zIndex: 999 }}>
                <div
                  onClick={() => handleSelectCategory(null)}
                  style={{ padding: '12px 20px', cursor: 'pointer', color: selectedCategory === null ? '#ff4d4f' : '#333', fontWeight: selectedCategory === null ? 'bold' : 'normal', borderBottom: '1px solid #eee' }}
                >
                  🏠 Tất cả sản phẩm
                </div>
                {CATEGORIES.map(cat => (
                  <div
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    style={{ padding: '12px 20px', cursor: 'pointer', color: selectedCategory === cat ? '#ff4d4f' : '#333', fontWeight: selectedCategory === cat ? 'bold' : 'normal', borderBottom: '1px solid #eee' }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NÚT CHỌN TỈNH THÀNH */}
          <button
            onClick={() => setShowProvinceModal(true)}
            style={{ backgroundColor: 'white', color: '#ff4d4f', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            📍 {selectedProvince}
          </button>

          <Link to="/myorders" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            📦 ĐƠN HÀNG CỦA TÔI
          </Link>

          <Link to="/cart" style={{ color: '#ff4d4f', backgroundColor: 'white', textDecoration: 'none', fontWeight: 'bold', padding: '8px 15px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
            GIỎ HÀNG ({mycart.length})
          </Link>
        </div>
      </div>
    </>
  );
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MyProvider>
      <BrowserRouter>
        <Header
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Routes>
          <Route path="/" element={
            <Home
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          } />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/myprofile" element={<MyProfile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </MyProvider>
  );
}

export default App;