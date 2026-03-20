import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ProductDetail = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [catID, setCatID] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [memory, setMemory] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    apiGetProducts();
    apiGetCategories();
  }, []);

  const apiGetProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };
  const apiGetCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  const previewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setImage(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setId(''); setName(''); setPrice(0); setCatID('');
    setImage(''); setDescription(''); setColor(''); setMemory('');
    setIsEditing(false);
  };

  const btnAddClick = async (e) => {
    e.preventDefault();
    const newProd = { name, price, category: catID, image, description, color, memory };
    const res = await api.post('/products', newProd);
    if (res.data.success) { alert('Thêm thành công!'); apiGetProducts(); resetForm(); }
  };

  const btnUpdateClick = async (e) => {
    e.preventDefault();
    const newProd = { name, price, category: catID, image, description, color, memory };
    const res = await api.put('/products/' + id, newProd);
    if (res.data.success) { alert('Sửa thành công!'); apiGetProducts(); resetForm(); }
  };

  const btnDeleteClick = async (id) => {
    if (window.confirm('Chắc chắn xóa sản phẩm này?')) {
      const res = await api.delete('/products/' + id);
      if (res.data.success) { alert('Xóa thành công!'); apiGetProducts(); resetForm(); }
    }
  };

  const trClick = (item) => {
    setId(item._id); setName(item.name); setPrice(item.price);
    setCatID(item.category?._id); setImage(item.image);
    setDescription(item.description); setColor(item.color); setMemory(item.memory);
    setIsEditing(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pd-root {
          font-family: 'DM Sans', sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
          padding: 32px;
          color: #1a1a1a;
        }

        .pd-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .pd-header h1 {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.3px;
          color: #111;
        }

        .pd-header .badge {
          background: #111;
          color: #f5f4f0;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .pd-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 20px;
          align-items: start;
        }

        /* TABLE PANEL */
        .pd-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
        }

        .pd-panel-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e8e6e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pd-panel-header h2 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #555;
        }

        .pd-table-wrap {
          overflow-x: auto;
        }

        table.pd-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .pd-table thead {
          background: #faf9f7;
        }

        .pd-table thead th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: #888;
          border-bottom: 1px solid #e8e6e1;
          white-space: nowrap;
        }

        .pd-table tbody tr {
          border-bottom: 1px solid #f0eeea;
          cursor: pointer;
          transition: background 0.15s;
        }

        .pd-table tbody tr:last-child { border-bottom: none; }

        .pd-table tbody tr:hover { background: #faf9f7; }

        .pd-table tbody tr.active {
          background: #f0f7ff;
          border-left: 3px solid #2563eb;
        }

        .pd-table td {
          padding: 12px 16px;
          color: #333;
          vertical-align: middle;
        }

        .pd-table td.mono {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #999;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pd-table td .price-tag {
          font-family: 'DM Mono', monospace;
          font-weight: 500;
          color: #16a34a;
          font-size: 13px;
        }

        .pd-table td img {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e8e6e1;
          background: #f5f4f0;
        }

        .cat-chip {
          display: inline-block;
          padding: 3px 10px;
          background: #f0eeea;
          border-radius: 20px;
          font-size: 12px;
          color: #555;
          font-weight: 500;
        }

        .btn-delete {
          background: none;
          border: 1px solid #fca5a5;
          color: #ef4444;
          padding: 5px 12px;
          border-radius: 7px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s;
        }

        .btn-delete:hover {
          background: #fef2f2;
          border-color: #ef4444;
        }

        /* FORM PANEL */
        .pd-form-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
          position: sticky;
          top: 24px;
        }

        .pd-form-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e8e6e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pd-form-header h2 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #555;
        }

        .pd-mode-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .pd-mode-tag.new { background: #dcfce7; color: #16a34a; }
        .pd-mode-tag.edit { background: #dbeafe; color: #2563eb; }

        .pd-form-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: #777;
          text-transform: uppercase;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #e0ddd8;
          border-radius: 8px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          background: #faf9f7;
          transition: border-color 0.15s, background 0.15s;
          outline: none;
        }

        .form-group input[readonly] {
          color: #999;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          background: #f5f4f0;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .image-upload-area {
          border: 1.5px dashed #d0cdc7;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          background: #faf9f7;
          cursor: pointer;
          transition: border-color 0.15s;
          position: relative;
        }

        .image-upload-area:hover { border-color: #2563eb; }

        .image-upload-area input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .image-upload-area .preview-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid #e0ddd8;
        }

        .image-upload-area .upload-hint {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .pd-form-actions {
          padding: 16px 24px;
          border-top: 1px solid #e8e6e1;
          display: flex;
          gap: 10px;
        }

        .btn {
          flex: 1;
          padding: 10px;
          border-radius: 9px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
        }

        .btn-primary {
          background: #111;
          color: #fff;
        }

        .btn-primary:hover { background: #333; }

        .btn-secondary {
          background: #2563eb;
          color: #fff;
        }

        .btn-secondary:hover { background: #1d4ed8; }
        .btn-secondary:disabled {
          background: #e0ddd8;
          color: #aaa;
          cursor: not-allowed;
        }

        .btn-ghost {
          background: none;
          border: 1px solid #e0ddd8;
          color: #666;
          padding: 10px;
          border-radius: 9px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-ghost:hover { background: #f5f4f0; }

        .empty-state {
          padding: 48px 24px;
          text-align: center;
          color: #aaa;
          font-size: 14px;
        }

        @media (max-width: 960px) {
          .pd-layout { grid-template-columns: 1fr; }
          .pd-form-panel { position: static; }
        }
      `}</style>

      <div className="pd-root">
        <div className="pd-header">
          <h1>Quản lý sản phẩm</h1>
          <span className="badge">{products.length} sản phẩm</span>
        </div>

        <div className="pd-layout">
          {/* TABLE */}
          <div className="pd-panel">
            <div className="pd-panel-header">
              <h2>Danh sách sản phẩm</h2>
            </div>
            <div className="pd-table-wrap">
              {products.length === 0 ? (
                <div className="empty-state">Chưa có sản phẩm nào.</div>
              ) : (
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Hình</th>
                      <th>Tên sản phẩm</th>
                      <th>Giá</th>
                      <th>Danh mục</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr
                        key={item._id}
                        onClick={() => trClick(item)}
                        className={id === item._id ? 'active' : ''}
                      >
                        <td className="mono">{item._id?.slice(-6)}</td>
                        <td>
                          <img src={item.image} alt={item.name} />
                        </td>
                        <td>{item.name}</td>
                        <td>
                          <span className="price-tag">
                            {Number(item.price).toLocaleString('vi-VN')}₫
                          </span>
                        </td>
                        <td>
                          {item.category?.name && (
                            <span className="cat-chip">{item.category.name}</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={(e) => { e.stopPropagation(); btnDeleteClick(item._id); }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="pd-form-panel">
            <div className="pd-form-header">
              <h2>Chi tiết sản phẩm</h2>
              <span className={`pd-mode-tag ${isEditing ? 'edit' : 'new'}`}>
                {isEditing ? 'Đang sửa' : 'Thêm mới'}
              </span>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="pd-form-body">
                {isEditing && (
                  <div className="form-group">
                    <label>ID</label>
                    <input type="text" value={id} readOnly />
                  </div>
                )}

                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên sản phẩm..."
                  />
                </div>

                <div className="form-group">
                  <label>Giá (VNĐ)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Danh mục</label>
                  <select value={catID} onChange={(e) => setCatID(e.target.value)}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Màu sắc</label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="VD: Đen, Trắng..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Bộ nhớ</label>
                    <input
                      type="text"
                      value={memory}
                      onChange={(e) => setMemory(e.target.value)}
                      placeholder="VD: 128GB..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Hình ảnh</label>
                  <div className="image-upload-area">
                    <input type="file" accept="image/*" onChange={previewImage} />
                    {image ? (
                      <>
                        <img src={image} className="preview-img" alt="preview" />
                        <div className="upload-hint">Nhấn để thay đổi ảnh</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                        <div className="upload-hint">Nhấn để chọn ảnh</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pd-form-actions">
                <button className="btn btn-primary" onClick={btnAddClick}>
                  + Thêm mới
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={btnUpdateClick}
                  disabled={!isEditing}
                >
                  Cập nhật
                </button>
                <button className="btn-ghost" onClick={resetForm} type="button">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;