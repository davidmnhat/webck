import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import banner5 from '../assets/banner5.png';
import banner6 from '../assets/banner6.png';

const BANNERS = [banner1, banner2, banner3, banner4, banner5, banner6];

// Thứ tự ưu tiên hiển thị danh mục (tuỳ chỉnh theo ý mày)
const CATEGORY_ORDER = ['Điện thoại', 'Macbook', 'Máy tính bảng', 'Phụ kiện'];

// ===================== BANNER =====================
const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
  const next = () => setCurrent(prev => (prev + 1) % BANNERS.length);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', marginBottom: '30px' }}>
      <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${current * 100}%)` }}>
        {BANNERS.map((url, i) => (
          <img key={i} src={url} alt={`banner-${i}`}
            style={{ minWidth: '100%', height: '350px', objectFit: 'contain', backgroundColor: '#f5f5f5' }} />
        ))}
      </div>

      <button onClick={prev} style={{
        position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
        borderRadius: '50%', width: '45px', height: '45px', fontSize: '20px',
        cursor: 'pointer', zIndex: 10
      }}>‹</button>

      <button onClick={next} style={{
        position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
        borderRadius: '50%', width: '45px', height: '45px', fontSize: '20px',
        cursor: 'pointer', zIndex: 10
      }}>›</button>

      <div style={{ position: 'absolute', bottom: '12px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {BANNERS.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? '20px' : '8px', height: '8px',
            borderRadius: '4px', backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer', transition: 'all 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
};

// ===================== PRODUCT CARD =====================
const ProductCard = ({ item }) => (
  <div style={{
    border: '1px solid #e0e0e0',
    padding: '15px',
    width: 'calc(25% - 12px)', // luôn 4 cái mỗi hàng (gap 16px chia cho 4)
    boxSizing: 'border-box',
    textAlign: 'center',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.12)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
  >
    <img src={item.image} alt={item.name}
      style={{ width: '100%', height: '160px', objectFit: 'contain' }} />
    <h4 style={{ margin: '8px 0 4px', fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>
      {item.name}
    </h4>
    <p style={{ color: '#e3000b', fontWeight: 'bold', margin: '4px 0 10px', fontSize: '15px' }}>
      {item.price.toLocaleString()} đ
    </p>
    <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
      <button style={{
        width: '100%', padding: '8px', backgroundColor: '#007bff',
        color: 'white', border: 'none', cursor: 'pointer',
        borderRadius: '6px', fontSize: '13px', fontWeight: 'bold'
      }}>
        XEM CHI TIẾT
      </button>
    </Link>
  </div>
);

// ===================== CATEGORY SECTION =====================
const CategorySection = ({ categoryName, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Header danh mục */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '16px', padding: '0 20px'
      }}>
        <span style={{
          backgroundColor: '#1d1d1f',
          color: 'white',
          padding: '5px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '14px',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
        }}>
          {categoryName.toUpperCase()}
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
        <Link
          to={`/?category=${encodeURIComponent(categoryName)}`}
          style={{ color: '#007bff', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Xem tất cả ›
        </Link>
      </div>

      {/* Lưới sản phẩm, 4-5 cái mỗi hàng, xuống dòng tự động */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '4px 20px 12px',
      }}>
        {products.map(item => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

// ===================== HOME =====================
const Home = ({ selectedCategory, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(MyContext);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).catch(err => console.error(err));
  }, []);

  // --- Nhóm sản phẩm theo danh mục ---
  const grouped = products.reduce((acc, p) => {
    const cat = p.category?.name || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // Sắp xếp theo CATEGORY_ORDER, phần còn lại xếp sau
  const sortedEntries = [
    ...CATEGORY_ORDER.filter(c => grouped[c]).map(c => [c, grouped[c]]),
    ...Object.entries(grouped).filter(([c]) => !CATEGORY_ORDER.includes(c)),
  ];

  // --- Lọc khi có filter / search ---
  const filteredProducts = products
    .filter(p => selectedCategory ? p.category?.name === selectedCategory : true)
    .filter(p => searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  const isFiltering = selectedCategory || searchQuery;

  return (
    <div style={{ padding: '0' }}>

      {/* Banner chỉ hiện ở trang chủ */}
      {!isFiltering && <Banner />}

      {isFiltering ? (
        // ===== CHẾ ĐỘ FILTER / SEARCH: grid cũ =====
        <div style={{ padding: '20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
            {searchQuery
              ? `KẾT QUẢ TÌM KIẾM: "${searchQuery}"`
              : `DANH MỤC: ${selectedCategory}`}
          </h2>

          {filteredProducts.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '50px', color: '#888' }}>
              Không tìm thấy sản phẩm nào!
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {filteredProducts.map(item => (
              <div key={item._id} style={{
                border: '1px solid #ccc', padding: '15px', width: '250px',
                textAlign: 'center', borderRadius: '10px'
              }}>
                <img src={item.image} alt={item.name}
                  style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
                <h3>{item.name}</h3>
                <p style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>
                  {item.price.toLocaleString()} đ
                </p>
                <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', padding: '10px 15px', backgroundColor: '#007bff',
                    color: 'white', border: 'none', cursor: 'pointer',
                    borderRadius: '5px', fontWeight: 'bold'
                  }}>
                    XEM CHI TIẾT & TÙY CHỌN
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ===== CHẾ ĐỘ HOME: từng section theo danh mục =====
        <div style={{ paddingTop: '10px', paddingBottom: '40px' }}>
          {sortedEntries.map(([catName, items]) => (
            <CategorySection key={catName} categoryName={catName} products={items} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;