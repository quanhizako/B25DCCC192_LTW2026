import React from 'react';
import { formatMoney } from '../data';

const History = ({ history = [], onClearHistory }) => {
  const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

  const highestPrize =
    history.length > 0
      ? history.reduce((max, item) => (item.prize > max ? item.prize : max), 0)
      : 0;

  const totalPrize = history.reduce((sum, item) => sum + item.prize, 0);

  return (
    <div className="page-container history-page">
      <h2 className="page-title">Lịch sử các lượt chơi</h2>

      <div className="history-stats">
        <p className="stat-line">
          {`Số lượt chơi: ${history.length}`}
        </p>
        <p className="stat-line">
          {`Tiền thưởng cao nhất: ${formatMoney(highestPrize)}`}
        </p>
        <p className="stat-line">
          {`Tổng tiền thưởng: ${formatMoney(totalPrize)}`}
        </p>
      </div>

      <div className="history-toolbar">
        <button
          type="button"
          onClick={onClearHistory}
          disabled={history.length === 0}
          className="btn btn-secondary delete-btn"
        >
          Xóa lịch sử
        </button>
      </div>

      {sortedHistory.length > 0 ? (
        <div className="table-responsive">
          <table className="questions-table history-table">
            <thead>
              <tr>
                <th>Người chơi</th>
                <th style={{ textAlign: 'center' }}>Số câu đúng</th>
                <th style={{ textAlign: 'right' }}>Tiền thưởng</th>
                <th style={{ textAlign: 'center' }}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((item) => (
                <tr key={item.id}>
                  <td className="player-col">
                    <strong>{item.name}</strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {item.correctCount}
                  </td>
                  <td style={{ textAlign: 'right' }} className="prize-col">
                    {formatMoney(item.prize)}
                  </td>
                  <td style={{ textAlign: 'center' }} className="time-col">
                    {item.playedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-message">Chưa có lượt chơi nào</p>
        </div>
      )}
    </div>
  );
};

export default History;
