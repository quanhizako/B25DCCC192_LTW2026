import React from 'react';

const AnswerButton = ({
  letter,
  text,
  isSelected,
  isCorrect,
  status,
  disabled,
  isHidden,
  onClick,
}) => {
  if (isHidden) {
    return (
      <button
        type="button"
        className="answer-button hidden-answer"
        disabled={true}
        aria-hidden="true"
      >
        <span style={{ visibility: 'hidden' }}>{letter}.</span>
      </button>
    );
  }

  let statusClass = '';
  if (status === 'locked' && isSelected) {
    statusClass = 'btn-locked';
  } else if (status === 'revealed') {
    if (isCorrect) {
      statusClass = 'btn-correct';
    } else if (isSelected && !isCorrect) {
      statusClass = 'btn-wrong';
    }
  }

  return (
    <button
      type="button"
      className={`answer-button ${statusClass}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="answer-letter">{letter}.</span>
      <span className="answer-text">{text}</span>
    </button>
  );
};

export default AnswerButton;
