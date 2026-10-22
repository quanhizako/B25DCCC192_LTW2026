import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
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
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Layout;
