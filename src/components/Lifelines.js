import React from 'react';

const Lifelines = ({
  lifelinesUsed,
  status,
  onUse5050,
  onUseAudience,
  onStopGame,
}) => {
  const isAnswering = status === 'answering';

  return (
    <div className="lifelines-container">
      <button
        type="button"
        className="lifeline-btn"
        disabled={!isAnswering || lifelinesUsed.half}
        onClick={onUse5050}
        title="Trợ giúp 50:50 (Loại bỏ 2 đáp án sai)"
      >
        <span className="lifeline-icon">✂️</span>
        <span className="lifeline-text">50:50</span>
      </button>

      <button
        type="button"
        className="lifeline-btn"
        disabled={!isAnswering || lifelinesUsed.audience}
        onClick={onUseAudience}
        title="Hỏi ý kiến khán giả trong trường quay"
      >
        <span className="lifeline-icon">👥</span>
        <span className="lifeline-text">Khán giả</span>
      </button>

      <button
        type="button"
        className="lifeline-btn stop-btn"
        disabled={!isAnswering || lifelinesUsed.stop}
        onClick={onStopGame}
        title="Dừng cuộc chơi và bảo toàn số tiền thưởng hiện tại"
      >
        <span className="lifeline-icon">🛑</span>
        <span className="lifeline-text">Dừng chơi</span>
      </button>
    </div>
  );
};

export default Lifelines;
