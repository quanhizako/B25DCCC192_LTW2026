import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions = [] }) => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryShift = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesLevel =
      selectedLevel === 'all' || String(q.level) === String(selectedLevel);
    const matchesSearch = q.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="page-container question-bank-page">
      <h2 className="page-title">Ngân hàng câu hỏi</h2>

      <div className="filter-controls">
        <div className="form-group">
          <label htmlFor="level-filter">Mức độ: </label>
          <select
            id="level-filter"
            value={selectedLevel}
            onChange={handleLevelChange}
            className="filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="1">Dễ</option>
            <option value="2">Trung bình</option>
            <option value="3">Khó</option>
          </select>
        </div>

        <div className="form-group search-group">
          <label htmlFor="question-search">Tìm kiếm: </label>
          <input
            id="question-search"
            type="text"
            placeholder="Tìm theo nội dung câu hỏi..."
            value={searchQuery}
            onChange={handleQueryShift}
            className="search-input"
          />
        </div>
      </div>

      <div className="question-count-badge">
        Có {filteredQuestions.length} câu hỏi.
      </div>

      <div className="table-responsive">
        <table className="questions-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>STT</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Mức độ</th>
              <th>Câu hỏi</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => (
                <tr key={q.id}>
                  <td style={{ textAlign: 'center' }}>{q.id}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`level-tag level-${q.level}`}>
                      {LEVELS[q.level]}
                    </span>
                  </td>
                  <td>
                    <Link to={`/questions/${q.id}`} className="question-link">
                      {q.question}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>
                  Không tìm thấy câu hỏi phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionBank;
