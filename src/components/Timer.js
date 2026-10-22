import React from 'react';

const Timer = ({ timeLeft }) => {
  const isWarning = timeLeft <= 10;

  return (
    <div className={`timer-container ${isWarning ? 'timer-danger' : ''}`}>
      <span className="timer-icon">⏱️</span>
      <span className="timer-text">Còn {timeLeft} giây</span>
    </div>
  );
};

export default Timer;
