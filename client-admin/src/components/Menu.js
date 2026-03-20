import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

const Menu = () => {
  const { setToken } = useContext(MyContext);
  const navigate = useNavigate();

  const btnLogoutClick = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="menu-admin">
        <div className="float-left">
          <div className="float-left">Admin Panel</div>
          <div className="float-clear"></div>
        </div>
        <div className="float-right">
            <Link to="/admin/home">Home</Link> | 
            <Link to="/admin/category">Category</Link> | 
            <Link to="/admin/product">Product</Link> | 
            <li className="menu"><Link to='/admin/order'>Order</Link></li>
            <a href="" onClick={(e) => { e.preventDefault(); btnLogoutClick(); }}>Logout</a>
        </div>
        <div className="float-clear"></div>
    </div>
  );
};
export default Menu;