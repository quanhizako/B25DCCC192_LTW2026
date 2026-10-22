import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
  const location = useLocation();

  return (
    <div className="app-layout">
      <NavBar />
      <main className="main-content">
        {loading ? (
          <div className="status-container">
            <div className="spinner"></div>
            <p className="status-message">Đang tải câu hỏi...</p>
          </div>
        ) : error ? (
          <div className="status-container error">
            <p className="status-message error-message">Không tải được câu hỏi</p>
          </div>
        ) : (
          <div key={location.pathname} className="page-transition-wrapper">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
