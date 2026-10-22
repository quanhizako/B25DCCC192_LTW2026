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
      />
    );
  }

  let statusClass = '';
  let inlineStyle = {};

  if (status === 'locked' && isSelected) {
    statusClass = 'btn-locked';
    inlineStyle = { backgroundColor: '#f97316', color: '#ffffff', borderColor: '#ea580c' };
  } else if (status === 'revealed') {
    if (isCorrect) {
      statusClass = 'btn-correct';
      inlineStyle = { backgroundColor: '#22c55e', color: '#ffffff', borderColor: '#16a34a' };
    } else if (isSelected && !isCorrect) {
      statusClass = 'btn-wrong';
      inlineStyle = { backgroundColor: '#ef4444', color: '#ffffff', borderColor: '#dc2626' };
    }
  }

  return (
    <button
      type="button"
      className={`answer-button ${statusClass}`}
      style={inlineStyle}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="answer-letter">{letter}. </span>
      <span className="answer-text">{text}</span>
    </button>
  );
};

export default AnswerButton;
