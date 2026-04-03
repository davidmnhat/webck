import Chatbot from './Chatbot';
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import MyContext from '../contexts/MyContext';
import { Link, useLocation } from 'react-router-dom';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import banner5 from '../assets/banner5.png';
import banner6 from '../assets/banner6.png';


const BANNERS = [banner1, banner2, banner3, banner4, banner5, banner6];
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
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', marginBottom: '30px', borderRadius: '10px' }}>
      <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${current * 100}%)` }}>
        {BANNERS.map((url, i) => (
          <img key={i} src={url} alt={`banner-${i}`}
            style={{ minWidth: '100%', height: '350px', objectFit: 'cover', backgroundColor: '#f5f5f5' }} />
        ))}
      </div>

      <button onClick={prev} style={{
        position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
        borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', zIndex: 10
      }}>‹</button>

      <button onClick={next} style={{
        position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
        borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', zIndex: 10
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

// ===================== SIDEBAR MENU =====================
const Sidebar = ({ products }) => {
  const [activeHover, setActiveHover] = useState(null);

  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
  const sortedCategories = [
    ...CATEGORY_ORDER.filter(c => categories.includes(c)),
    ...categories.filter(c => !CATEGORY_ORDER.includes(c))
  ];

  const getSubCategories = (catName) => {
    const catProducts = products.filter(p => p.category?.name === catName);
    
    const subCats = [...new Set(catProducts.map(p => {
      if (p.series) return p.series;
      if (p.name.toLowerCase().includes('headphone')) return 'Headphone';
      const parts = p.name.split(' ');
      return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0];
    }))];
    
    return subCats.slice(0, 15);
  };

  return (
    <div style={{ position: 'relative', width: '250px', zIndex: 100 }}>
      <div 
        style={{
          backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
          padding: '10px 0', border: '1px solid #e0e0e0', minHeight: '350px'
        }}
        onMouseLeave={() => setActiveHover(null)} 
      >
        {sortedCategories.map((cat, index) => (
          <div
            key={index}
            onMouseEnter={() => setActiveHover(cat)}
            style={{
              padding: '12px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', backgroundColor: activeHover === cat ? '#f1f1f1' : 'transparent',
              fontWeight: activeHover === cat ? 'bold' : 'normal', color: activeHover === cat ? '#e3000b' : '#333',
            }}
          >
            <span>{cat}</span>
            <span style={{ fontSize: '12px' }}>›</span>

            {activeHover === cat && (
              <div style={{
                position: 'absolute', top: 0, left: '100%', marginLeft: '2px', width: '500px', minHeight: '100%',
                backgroundColor: '#fff', borderRadius: '10px', boxShadow: '4px 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px',
                alignContent: 'flex-start', cursor: 'default'
              }}>
                <div style={{ width: '100%' }}>
                  <h4 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #f1f1f1', paddingBottom: '10px', color: '#1d1d1f' }}>
                    Các dòng {cat}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {getSubCategories(cat).map((sub, i) => (
                      <Link
                        key={i}
                        to={`/?category=${encodeURIComponent(cat)}&search=${encodeURIComponent(sub)}`}
                        style={{
                          padding: '8px 16px', backgroundColor: '#f8f9fa', border: '1px solid #ddd',
                          borderRadius: '6px', textDecoration: 'none', color: '#333', fontSize: '14px'
                        }}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ===================== PRODUCT CARD =====================
const ProductCard = ({ item }) => (
  <div style={{
    border: '1px solid #e0e0e0', padding: '15px', width: 'calc(25% - 12px)',
    boxSizing: 'border-box', textAlign: 'center', borderRadius: '10px', backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  }}>
    <img src={item.image} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'contain' }} />
    <h4 style={{ 
      margin: '8px 0 4px', 
      fontSize: '14px', 
      fontWeight: '600', 
      color: '#1d1d1f',
      textTransform: 'capitalize' 
    }}>
      {item.name}
    </h4>
    <p style={{ color: '#e3000b', fontWeight: 'bold', margin: '4px 0 10px', fontSize: '15px' }}>
      {item.price.toLocaleString()} đ
    </p>
    <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
      <button style={{
        width: '100%', padding: '8px', backgroundColor: '#007bff', color: 'white',
        border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold'
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{
          backgroundColor: '#1d1d1f', color: 'white', padding: '5px 16px', borderRadius: '20px',
          fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap',
        }}>
          {categoryName.toUpperCase()}
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
        <Link to={`/?category=${encodeURIComponent(categoryName)}`} style={{ color: '#007bff', fontSize: '13px', textDecoration: 'none' }}>
          Xem tất cả ›
        </Link>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '4px 0 12px' }}>
        {products.map(item => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

// ===================== HOME =====================
//  Đã thêm `searchQuery` vào props để hứng dữ liệu từ thanh Header
const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  //const { addToCart } = useContext(MyContext);//
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get('category');
  const urlSearch = queryParams.get('search');

  //  Gộp 2 nguồn search lại: Nếu gõ trên thanh thì dùng searchQuery, nếu click menu thì dùng urlSearch
  const activeSearch = urlSearch || searchQuery;

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).catch(err => console.error(err));
  }, []);

  const grouped = products.reduce((acc, p) => {
    const cat = p.category?.name || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const sortedEntries = [
    ...CATEGORY_ORDER.filter(c => grouped[c]).map(c => [c, grouped[c]]),
    ...Object.entries(grouped).filter(([c]) => !CATEGORY_ORDER.includes(c)),
  ];

  // ✅ Bộ lọc đã sử dụng biến activeSearch
  const filteredProducts = products
    .filter(p => urlCategory ? p.category?.name === urlCategory : true)
    .filter(p => activeSearch ? p.name.toLowerCase().includes(activeSearch.toLowerCase()) : true);

  const isFiltering = urlCategory || activeSearch;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {!isFiltering ? (
        // ===== CHẾ ĐỘ HOME MẶC ĐỊNH =====
        <>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <Sidebar products={products} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Banner />
            </div>
          </div>

          <div style={{ paddingTop: '10px', paddingBottom: '40px' }}>
            {sortedEntries.map(([catName, items]) => (
              <CategorySection key={catName} categoryName={catName} products={items} />
            ))}
          </div>
        </>
      ) : (
        // ===== CHẾ ĐỘ HIỂN THỊ KHI BẤM VÀO MENU HOẶC TÌM KIẾM =====
        <div style={{ padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>
              {activeSearch ? `KẾT QUẢ TÌM KIẾM: "${activeSearch}"` : `DANH MỤC: ${urlCategory}`}
            </h2>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
              ‹ Quay lại trang chủ
            </Link>
          </div>

          {filteredProducts.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '50px', color: '#888' }}>
              Không tìm thấy sản phẩm nào!
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {filteredProducts.map(item => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
};

export default Home;