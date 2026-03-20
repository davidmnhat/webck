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
// Thay các URL này bằng ảnh của mày
const BANNERS = [banner1, banner2, banner3, banner4, banner5, banner6];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  // Tự động chuyển sau 3 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(timer); // Dọn dẹp khi unmount
  }, []);

  const prev = () => setCurrent(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
  const next = () => setCurrent(prev => (prev + 1) % BANNERS.length);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', marginBottom: '30px' }}>
      
      {/* ẢNH BANNER */}
      <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${current * 100}%)` }}>
        {BANNERS.map((url, i) => (
  <img key={i} src={url} alt={`banner-${i}`}
    style={{ minWidth: '100%', height: '350px', objectFit: 'contain', backgroundColor: '#f5f5f5' }} />
))}
      </div>

      {/* NÚT TRÁI */}
      <button onClick={prev} style={{
        position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
        borderRadius: '50%', width: '45px', height: '45px', fontSize: '20px',
        cursor: 'pointer', zIndex: 10
      }}>‹</button>

      {/* NÚT PHẢI */}
      <button onClick={next} style={{
        position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: 'none',
        borderRadius: '50%', width: '45px', height: '45px', fontSize: '20px',
        cursor: 'pointer', zIndex: 10
      }}>›</button>

      {/* DOTS CHỈ SỐ TRANG */}
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

const Home = ({ selectedCategory, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(MyContext);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).catch(err => console.error(err));
  }, []);

  const filteredProducts = products
    .filter(p => selectedCategory ? p.category?.name === selectedCategory : true)
    .filter(p => searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  return (
    <div style={{ padding: '0' }}>
      
      {/* BANNER - chỉ hiện khi không filter */}
      {!selectedCategory && !searchQuery && <Banner />}

      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>
          {searchQuery ? `KẾT QUẢ TÌM KIẾM: "${searchQuery}"`
            : selectedCategory ? `DANH MỤC: ${selectedCategory}`
            : 'SẢN PHẨM MỚI NHẤT'}
        </h2>

        {filteredProducts.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '50px', color: '#888' }}>
            😔 Không tìm thấy sản phẩm nào!
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {filteredProducts.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '15px', width: '250px', textAlign: 'center', borderRadius: '10px' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
              <h3>{item.name}</h3>
              <p style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>{item.price.toLocaleString()} đ</p>
              <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
                  XEM CHI TIẾT & TÙY CHỌN
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;