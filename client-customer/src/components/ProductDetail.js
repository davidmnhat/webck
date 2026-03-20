import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import MyContext from '../contexts/MyContext';

const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // State lưu tùy chọn đang được click
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMemory, setSelectedMemory] = useState('');
  
  const { addToCart } = useContext(MyContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get('/products');
      const foundProduct = res.data.find(x => x._id === params.id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        // Tự động chọn option đầu tiên làm mặc định
        if (foundProduct.color) setSelectedColor(foundProduct.color.split(',')[0].trim());
        if (foundProduct.memory) setSelectedMemory(foundProduct.memory.split(',')[0].trim());
      }
    };
    fetchProduct();
  }, [params.id]);

  if (!product) return <h2 style={{ textAlign: 'center' }}>Đang tải dữ liệu...</h2>;

  return (
    <div style={{ display: 'flex', padding: '50px', justifyContent: 'center', gap: '40px' }}>
      <div style={{ width: '400px' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px', border: '1px solid #ddd' }} />
      </div>

      <div style={{ width: '500px' }}>
        <h2>{product.name}</h2>
        <h3 style={{ color: 'red' }}>{product.price.toLocaleString()} VNĐ</h3>
        <p><strong>Mô tả:</strong> {product.description}</p>
        
        {/* KHU VỰC CHỌN MÀU SẮC */}
        {product.color && (
          <div style={{ margin: '15px 0' }}>
            <strong>Màu sắc: </strong> <br/>
            {product.color.split(',').map((c, index) => {
              const colorName = c.trim();
              return (
                <button 
                  key={index}
                  onClick={() => setSelectedColor(colorName)}
                  style={{
                    padding: '8px 15px', margin: '5px 5px 0 0', cursor: 'pointer', borderRadius: '5px',
                    backgroundColor: selectedColor === colorName ? '#ff4d4f' : 'white',
                    color: selectedColor === colorName ? 'white' : 'black',
                    border: selectedColor === colorName ? 'none' : '1px solid #ccc'
                  }}
                >
                  {colorName}
                </button>
              )
            })}
          </div>
        )}

        {/* KHU VỰC CHỌN BỘ NHỚ */}
        {product.memory && (
          <div style={{ margin: '15px 0' }}>
            <strong>Cấu hình: </strong> <br/>
            {product.memory.split(',').map((m, index) => {
              const memName = m.trim();
              return (
                <button 
                  key={index}
                  onClick={() => setSelectedMemory(memName)}
                  style={{
                    padding: '8px 15px', margin: '5px 5px 0 0', cursor: 'pointer', borderRadius: '5px',
                    backgroundColor: selectedMemory === memName ? '#007bff' : 'white',
                    color: selectedMemory === memName ? 'white' : 'black',
                    border: selectedMemory === memName ? 'none' : '1px solid #ccc'
                  }}
                >
                  {memName}
                </button>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <strong>Số lượng: </strong>
          <input 
            type="number" min="1" value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={{ width: '60px', padding: '5px', fontSize: '16px', textAlign: 'center' }}
          />
        </div>

        {/* Cập nhật nút truyền đủ tham số */}
        <button 
          onClick={() => addToCart(product, quantity, selectedColor, selectedMemory)}
          style={{ padding: '15px 30px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold' }}>
          🛒 THÊM VÀO GIỎ HÀNG
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;