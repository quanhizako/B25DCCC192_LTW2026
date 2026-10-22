import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const getNavStyle = ({ isActive }) => ({
    color: isActive ? 'red' : '#ffffff',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  });

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">⭐</span>
          <span className="logo-text">AI LÀ TRIỆU PHÚ</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" end style={getNavStyle} className="nav-link-item">
            Trang chủ
          </NavLink>
          <NavLink to="/questions" style={getNavStyle} className="nav-link-item">
            Ngân hàng câu hỏi
          </NavLink>
          <NavLink to="/history" style={getNavStyle} className="nav-link-item">
            Lịch sử
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
