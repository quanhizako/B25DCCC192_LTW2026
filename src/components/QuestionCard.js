import React from 'react';
import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({
  questionNumber,
  question,
  status,
  selectedAnswer,
  hiddenOptions = [],
  onSelectAnswer,
}) => {
  if (!question) {
    return null;
  }

  const isAnswering = status === 'answering';

  return (
    <div className="question-card">
      <div className="question-header-row">
        <span className="question-badge">Câu {questionNumber}/15</span>
      </div>

      <div className="question-prompt">
        <h3 className="prompt-text">{question.question}</h3>
      </div>

      <div className="answers-grid">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = question.answer === index;
          const isHidden = hiddenOptions.includes(index);

          return (
            <AnswerButton
              key={index}
              letter={LETTERS[index]}
              text={option}
              index={index}
              isSelected={isSelected}
              isCorrect={isCorrect}
              status={status}
              disabled={!isAnswering || isHidden}
              isHidden={isHidden}
              onClick={() => onSelectAnswer(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
