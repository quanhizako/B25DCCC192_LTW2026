import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-container not-found-page">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">404 - Không tìm thấy trang</h2>
        <p className="error-desc">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã bị thay đổi.
        </p>
        <Link to="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
