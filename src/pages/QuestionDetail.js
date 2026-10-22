import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const numId = Number(id);
  const question = questions.find((q) => q.id === numId);

  if (!question) {
    return (
      <div className="page-container question-detail-page">
        <div className="not-found-card">
          <p className="not-found-message">Không tìm thấy câu hỏi</p>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container question-detail-page">
      <div className="detail-card">
        <h2 className="question-header">
          {`Câu hỏi số ${question.id} (${LEVELS[question.level]})`}
        </h2>
        <p className="question-body">{question.question}</p>

        <div className="options-list">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.answer;
            return (
              <div
                key={idx}
                className={`option-item ${isCorrect ? 'correct-option' : ''}`}
              >
                <span className="option-letter">{LETTERS[idx]}.</span>
                <span className="option-text">{option}</span>
                {isCorrect && (
                  <span className="correct-tag"> (Đáp án đúng)</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
