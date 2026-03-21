import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

const Menu = () => {
  const { setToken } = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

  const btnLogoutClick = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/home',     label: 'Home',     icon: '⊞' },
    { to: '/admin/category', label: 'Category', icon: '🏷️' },
    { to: '/admin/product',  label: 'Product',  icon: '📦' },
    { to: '/admin/order',    label: 'Order',    icon: '🧾' },
  ];

  return (
    <>
      <style>{`
        
        .admin-navbar {
          font-family: Arial, Helvetica, sans-serif;
          background: #ff4d4f;
          border-bottom: 1px solid #222;
          padding: 0 32px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brand-icon {
          width: 28px;
          height: 28px;
          background: #fff;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .brand-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.2px;
        }

        .brand-tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #666;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 1px;
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          color: #fff;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .nav-link:hover { color: #fff; background: #1e1e1e; }

        .nav-link.active {
          color: #fff;
          background: #1e1e1e;
        }

        .nav-link .nav-icon {
          font-size: 13px;
          line-height: 1;
        }

        .nav-divider {
          width: 1px;
          height: 18px;
          background: #2a2a2a;
          margin: 0 6px;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          background: none;
          color: #fff;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-logout:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.06);
        }

        @media (max-width: 640px) {
          .admin-navbar { padding: 0 16px; }
          .brand-tag { display: none; }
          .nav-link span:not(.nav-icon) { display: none; }
          .nav-link { padding: 6px 10px; }
        }
      `}</style>

      <nav className="admin-navbar">
        {/* Brand */}
        <Link to="/admin/home" className="navbar-brand">
          <div className="brand-icon">⚡</div>
          <div>
            <div className="brand-name">Admin Panel</div>
            <div className="brand-tag">Dashboard</div>
          </div>
        </Link>

        {/* Nav links */}
        <ul className="navbar-nav">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`nav-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}

          <div className="nav-divider" />

          <li>
            <button className="btn-logout" onClick={btnLogoutClick}>
              <span>↪</span>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Menu;