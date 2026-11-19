import React, { useReducer, useEffect, useMemo, useRef, useState } from 'react';
import { SEMESTERS, CREDIT_OPTIONS, formatPoint } from './data';
import { getGrade, calcStats } from './utils';
import { coursesReducer } from './coursesReducer';
import { useFetch } from './hooks/useFetch';

const BUILD_TAG = "gp-4073";

function App() {
  const { data, loading, error } = useFetch('/data/courses.json');
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const [selectedSemester, setSelectedSemester] = useState('all');

  // Form state
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formCredits, setFormCredits] = useState(3);
  const [formSemester, setFormSemester] = useState(SEMESTERS[0]);
  const [formScore, setFormScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeRef = useRef(null);

  // Sync data when loaded
  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  // Placeholder for search handler as required
  // eslint-disable-next-line no-unused-vars
  const handleCourseShift = () => {};

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedSemester !== 'all' && c.semester !== selectedSemester) {
        return false;
      }
      return true;
    });
  }, [courses, selectedSemester]);

  // Statistics
  const currentStats = useMemo(() => calcStats(filteredCourses), [filteredCourses]);
  const totalStats = useMemo(() => calcStats(courses), [courses]);

  const handleScoreChange = (id, e) => {
    const val = e.target.valueAsNumber;
    if (!isNaN(val) && val >= 0 && val <= 10) {
      dispatch({ type: 'SET_SCORE', payload: { id, score: val } });
    }
  };

  const handleDelete = (id) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmedCode = formCode.trim();
    if (!trimmedCode) {
      newErrors.code = 'Hãy nhập mã môn';
    } else if (
      courses.some(
        (c) => c.code.trim().toLowerCase() === trimmedCode.toLowerCase()
      )
    ) {
      newErrors.code = 'Mã môn đã tồn tại';
    }

    const trimmedName = formName.trim();
    if (!trimmedName) {
      newErrors.name = 'Hãy nhập tên môn';
    }

    if (
      formScore === '' ||
      isNaN(Number(formScore)) ||
      Number(formScore) < 0 ||
      Number(formScore) > 10
    ) {
      newErrors.score = 'Điểm phải từ 0 đến 10';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch({
        type: 'ADD',
        payload: {
          code: trimmedCode.toUpperCase(),
          name: trimmedName,
          credits: Number(formCredits),
          semester: formSemester,
          score: Number(formScore),
        },
      });
      setFormCode('');
      setFormName('');
      setFormCredits(3);
      setFormSemester(SEMESTERS[0]);
      setFormScore('');
      setErrors({});
      if (codeRef.current) {
        codeRef.current.focus();
      }
    }
  };

  if (loading) {
    return (
      <div className="app light" data-build={BUILD_TAG}>
        <p>Đang tải bảng điểm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app light" data-build={BUILD_TAG}>
        <p>Không tải được bảng điểm</p>
      </div>
    );
  }

  return (
    <div className="app light" data-build={BUILD_TAG}>
      <header className="header-section">
        <h1>Sổ điểm sinh viên</h1>
      </header>

      {/* Khu vực Thống kê */}
      <section className="stats-section">
        <h2>Thống kê</h2>
        <p>Số môn: {currentStats.count}</p>
        <p>Tổng tín chỉ: {currentStats.credits}</p>
        <p>GPA (hệ 4): {currentStats.gpa.toFixed(2)}</p>
        <p>Xếp loại: {currentStats.rank}</p>
        <p>GPA tích lũy: {totalStats.gpa.toFixed(2)}</p>
      </section>

      {/* Lọc học kỳ */}
      <div className="controls-section">
        <label htmlFor="filter-semester">Xem học kỳ</label>
        <select
          id="filter-semester"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="all">Tất cả</option>
          {SEMESTERS.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Bảng điểm */}
      {courses.length === 0 ? (
        <p>Chưa có môn học nào</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên môn</th>
              <th>Tín chỉ</th>
              <th>Học kỳ</th>
              <th>Điểm (hệ 10)</th>
              <th>Điểm chữ</th>
              <th>Điểm (hệ 4)</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((c) => {
              const grade = getGrade(c.score);
              const isFailed = grade.letter === 'F';
              return (
                <tr
                  key={c.id}
                  className={isFailed ? 'row-failed' : ''}
                  style={isFailed ? { color: '#c62828' } : undefined}
                >
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.credits}</td>
                  <td>{c.semester}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      aria-label={`Điểm ${c.name}`}
                      value={c.score}
                      onChange={(e) => handleScoreChange(c.id, e)}
                      className="input-score"
                    />
                  </td>
                  <td>{isFailed ? 'F – Học lại' : grade.letter}</td>
                  <td>{formatPoint(grade.point)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Form Thêm môn học */}
      <section className="form-section">
        <h2>Thêm môn học</h2>
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label htmlFor="code">Mã môn</label>
            <input
              id="code"
              type="text"
              ref={codeRef}
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
            />
            {errors.code && (
              <div role="alert" className="error-text">
                {errors.code}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">Tên môn</label>
            <input
              id="name"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            {errors.name && (
              <div role="alert" className="error-text">
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="credits">Số tín chỉ</label>
            <select
              id="credits"
              value={formCredits}
              onChange={(e) => setFormCredits(Number(e.target.value))}
            >
              {CREDIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semester">Học kỳ</label>
            <select
              id="semester"
              value={formSemester}
              onChange={(e) => setFormSemester(e.target.value)}
            >
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="score">Điểm hệ 10</label>
            <input
              id="score"
              type="number"
              step="0.1"
              value={formScore}
              onChange={(e) => setFormScore(e.target.value)}
            />
            {errors.score && (
              <div role="alert" className="error-text">
                {errors.score}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Thêm môn
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
