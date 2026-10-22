import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { name, prize, correctCount, reason } = state;

  const getReasonTitle = (r) => {
    switch (r) {
      case 'win':
        return 'Chúc mừng! Bạn đã trở thành triệu phú';
      case 'wrong':
        return 'Rất tiếc, bạn đã trả lời sai';
      case 'timeout':
        return 'Hết giờ!';
      case 'stop':
        return 'Bạn đã dừng cuộc chơi';
      default:
        return 'Kết thúc lượt chơi';
    }
  };

  const handlePlayAgain = () => {
    navigate('/play');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const isWinner = reason === 'win';

  return (
    <div className="page-container result-page">
      <div className={`result-card ${isWinner ? 'winner-card' : ''}`}>
        <h2 className="result-headline">{getReasonTitle(reason)}</h2>

        <div className="result-info-box">
          <p className="result-info-row">
            <span className="info-label">Người chơi: </span>
            <span className="info-value">{name}</span>
          </p>
          <p className="result-info-row">
            <span className="info-label">Số câu trả lời đúng: </span>
            <span className="info-value">{correctCount}</span>
          </p>
          <p className="result-info-row highlight-row">
            <span className="info-label">Tiền thưởng: </span>
            <span className="info-value prize-value">{formatMoney(prize)}</span>
          </p>
        </div>

        <div className="result-actions">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="btn btn-primary"
          >
            Chơi lại
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="btn btn-secondary"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
