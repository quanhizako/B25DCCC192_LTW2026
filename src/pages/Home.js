import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history = [] }) => {
  const navigate = useNavigate();

  const handleStartGame = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      navigate('/play');
    }
  };

  const highestRecord =
    history.length > 0
      ? [...history].sort((a, b) => b.prize - a.prize)[0]
      : null;

  return (
    <div className="page-container home-page">
      <div className="home-hero">
        <h1 className="main-title">AI LÀ TRIỆU PHÚ</h1>
        <p className="subtitle">Phiên bản Lập trình Web đặc biệt</p>

        {highestRecord && (
          <div className="record-badge">
            {`Kỷ lục: ${formatMoney(highestRecord.prize)} – ${highestRecord.name}`}
          </div>
        )}
      </div>

      <div className="rules-section">
        <h3 className="section-title">Luật chơi</h3>
        <ul className="rules-list">
          <li>
            Vượt qua <strong>15 câu hỏi</strong> trắc nghiệm về HTML, CSS, ES6
            và React.
          </li>
          <li>
            Mỗi câu hỏi có <strong>30 giây</strong> để suy nghĩ và chọn đáp án.
          </li>
          <li>
            Ba mốc an toàn quan trọng: <strong>Câu 5, Câu 10 và Câu 15</strong>.
          </li>
          <li>
            Nếu trả lời sai hoặc hết giờ, bạn sẽ nhận số tiền ở mốc an toàn cao
            nhất đã vượt qua.
          </li>
          <li>
            Giải thưởng cao nhất là <strong>250.000.000 đ</strong> khi hoàn
            thành 15 câu!
          </li>
          <li>
            Bạn có 3 quyền trợ giúp: <strong>50:50</strong>,{' '}
            <strong>Hỏi ý kiến khán giả</strong>, và{' '}
            <strong>Dừng cuộc chơi</strong>.
          </li>
        </ul>
      </div>

      <form onSubmit={handleStartGame} className="player-form">
        <div className="input-group">
          <label htmlFor="player-name-input">Tên người chơi:</label>
          <input
            id="player-name-input"
            type="text"
            placeholder="Nhập tên của bạn để bắt đầu..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="player-input"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!playerName.trim()}
          className="btn btn-primary start-btn"
        >
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;
