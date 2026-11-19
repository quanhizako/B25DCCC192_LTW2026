import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SEMESTERS, formatPoint } from './data';
import { getGrade, calcStats } from './utils';
import { useFetch } from './hooks/useFetch';
import {
  selectCourses,
  setCourses,
  removeCourse,
  setScore,
} from './features/coursesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { AddCourseForm } from './components/AddCourseForm';
import { GoalPlanner } from './components/GoalPlanner';

const BUILD_TAG = "gp-4073";

function App() {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [selectedSemester, setSelectedSemester] = useState('all');

  // Load sample courses into redux store
  useEffect(() => {
    if (data) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

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
      dispatch(setScore({ id, score: val }));
    }
  };

  const handleDelete = (c) => {
    dispatch(removeCourse(c.id));
    showNotice(`Đã xóa môn ${c.name}`);
  };

  if (loading) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <p>Đang tải bảng điểm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <p>Không tải được bảng điểm</p>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header className="header-section">
        <div>
          <h1>Sổ điểm sinh viên</h1>
          <button type="button" className="theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </button>
        </div>
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
                      onClick={() => handleDelete(c)}
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

      {/* Thêm môn học */}
      <AddCourseForm />

      {/* Mục tiêu GPA */}
      <GoalPlanner />
    </div>
  );
}

export default App;
