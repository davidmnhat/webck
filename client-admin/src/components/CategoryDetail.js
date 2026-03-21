import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CategoryDetail = () => {
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { apiGetCategories(); }, []);

  const apiGetCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  const resetForm = () => { setId(''); setName(''); setIsEditing(false); };

  const btnAddClick = async (e) => {
    e.preventDefault();
    const res = await api.post('/categories', { name });
    if (res.data.success) { alert('Thêm thành công!'); apiGetCategories(); resetForm(); }
  };

  const btnUpdateClick = async (e) => {
    e.preventDefault();
    const res = await api.put('/categories/' + id, { name });
    if (res.data.success) { alert('Cập nhật thành công!'); apiGetCategories(); resetForm(); }
  };

  const btnDeleteClick = async (item) => {
    if (window.confirm('Chắc chắn xóa danh mục này?')) {
      const res = await api.delete('/categories/' + item._id);
      if (res.data.success) { alert('Xóa thành công!'); apiGetCategories(); resetForm(); }
    }
  };

  return (
    <>
      <style>{`
        

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cd-root {
          font-family: Arial, Helvetica, sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
          padding: 32px;
          color: #1a1a1a;
        }

        .cd-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .cd-header h1 {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.3px;
          color: #111;
        }

        .cd-header .badge {
          background: #111;
          color: #f5f4f0;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .cd-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }

        .cd-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
        }

        .cd-panel-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e8e6e1;
        }

        .cd-panel-header h2 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #555;
        }

        .cd-table-wrap { overflow-x: auto; }

        table.cd-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .cd-table thead { background: #faf9f7; }

        .cd-table thead th {
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

        .cd-table tbody tr {
          border-bottom: 1px solid #f0eeea;
          cursor: pointer;
          transition: background 0.15s;
        }

        .cd-table tbody tr:last-child { border-bottom: none; }
        .cd-table tbody tr:hover { background: #faf9f7; }

        .cd-table tbody tr.active {
          background: #f0f7ff;
          border-left: 3px solid #2563eb;
        }

        .cd-table td {
          padding: 13px 16px;
          color: #333;
          vertical-align: middle;
        }

        .cd-table td.mono {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #999;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cd-table td .name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cd-table td .name-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f0eeea;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
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

        .btn-delete:hover { background: #fef2f2; border-color: #ef4444; }

        .empty-state {
          padding: 48px 24px;
          text-align: center;
          color: #aaa;
          font-size: 14px;
        }

        /* FORM PANEL */
        .cd-form-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
          position: sticky;
          top: 24px;
        }

        .cd-form-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e8e6e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cd-form-header h2 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #555;
        }

        .cd-mode-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .cd-mode-tag.new { background: #dcfce7; color: #16a34a; }
        .cd-mode-tag.edit { background: #dbeafe; color: #2563eb; }

        .cd-form-body {
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

        .form-group input {
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

        .form-group input:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .cd-form-actions {
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

        .btn-primary { background: #111; color: #fff; }
        .btn-primary:hover { background: #333; }

        .btn-secondary { background: #2563eb; color: #fff; }
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

        @media (max-width: 768px) {
          .cd-layout { grid-template-columns: 1fr; }
          .cd-form-panel { position: static; }
        }
      `}</style>

      <div className="cd-root">
        <div className="cd-header">
          <h1>Quản lý danh mục</h1>
          <span className="badge">{categories.length} danh mục</span>
        </div>

        <div className="cd-layout">
          {/* TABLE */}
          <div className="cd-panel">
            <div className="cd-panel-header">
              <h2>Danh sách danh mục</h2>
            </div>
            <div className="cd-table-wrap">
              {categories.length === 0 ? (
                <div className="empty-state">Chưa có danh mục nào.</div>
              ) : (
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên danh mục</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item) => (
                      <tr
                        key={item._id}
                        className={id === item._id ? 'active' : ''}
                        onClick={() => { setId(item._id); setName(item.name); setIsEditing(true); }}
                      >
                        <td className="mono">{item._id?.slice(-6)}</td>
                        <td>
                          <div className="name-cell">
                            <div className="name-icon">🏷️</div>
                            {item.name}
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={(e) => { e.stopPropagation(); btnDeleteClick(item); }}
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
          <div className="cd-form-panel">
            <div className="cd-form-header">
              <h2>Chi tiết danh mục</h2>
              <span className={`cd-mode-tag ${isEditing ? 'edit' : 'new'}`}>
                {isEditing ? 'Đang sửa' : 'Thêm mới'}
              </span>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="cd-form-body">
                {isEditing && (
                  <div className="form-group">
                    <label>ID</label>
                    <input type="text" value={id} readOnly />
                  </div>
                )}
                <div className="form-group">
                  <label>Tên danh mục</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên danh mục..."
                  />
                </div>
              </div>

              <div className="cd-form-actions">
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

export default CategoryDetail;