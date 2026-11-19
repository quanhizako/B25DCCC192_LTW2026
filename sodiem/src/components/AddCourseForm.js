import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SEMESTERS, CREDIT_OPTIONS } from '../data';
import { addCourse, selectCourses } from '../features/coursesSlice';
import { useNotice } from '../context/NoticeContext';

export const AddCourseForm = () => {
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const showNotice = useNotice();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      newErrors.code = 'Hãy nhập mã môn';
    } else if (
      courses.some(
        (c) => c.code.trim().toLowerCase() === trimmedCode.toLowerCase()
      )
    ) {
      newErrors.code = 'Mã môn đã tồn tại';
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Hãy nhập tên môn';
    }

    if (
      score === '' ||
      isNaN(Number(score)) ||
      Number(score) < 0 ||
      Number(score) > 10
    ) {
      newErrors.score = 'Điểm phải từ 0 đến 10';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(
        addCourse({
          code: trimmedCode.toUpperCase(),
          name: trimmedName,
          credits: Number(credits),
          semester,
          score: Number(score),
        })
      );
      showNotice(`Đã thêm môn ${trimmedName}`);
      setCode('');
      setName('');
      setCredits(3);
      setSemester(SEMESTERS[0]);
      setScore('');
      setErrors({});
      if (codeRef.current) {
        codeRef.current.focus();
      }
    }
  };

  return (
    <section className="form-section">
      <h2>Thêm môn học</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Mã môn</label>
          <input
            id="code"
            type="text"
            ref={codeRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
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
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
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
            value={score}
            onChange={(e) => setScore(e.target.value)}
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
  );
};
