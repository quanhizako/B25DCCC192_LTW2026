import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SEMESTERS, GRADES } from './data';
import { getGrade, calcStats } from './utils';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import {
  selectCourses,
  setCourses,
  addCourse,
  removeCourse,
  setScore,
} from './features/coursesSlice';
import { hasSaved } from './store';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { CourseRow } from './components/CourseRow';
import { AddCourseForm } from './components/AddCourseForm';
import { GoalPlanner } from './components/GoalPlanner';

const BUILD_TAG = "gp-4073";

function App() {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [selectedSemester, setSelectedSemester] = useLocalStorage(
    'ltw_sodiem_semester',
    'all'
  );
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  const [sortOrder, setSortOrder] = useState('none');
  const [lastDeleted, setLastDeleted] = useState(null);

  useEffect(() => {
    if (!hasSaved && data && courses.length === 0) {
      dispatch(setCourses(data));
    }
  }, [data, courses.length, dispatch]);

  const totalStats = useMemo(() => calcStats(courses), [courses]);
  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${totalStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, totalStats.gpa]);

  const handleCourseShift = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/') {
        const activeEl = document.activeElement;
        const isInput =
          activeEl &&
          (activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'SELECT' ||
            activeEl.tagName === 'TEXTAREA' ||
            activeEl.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          searchRef.current?.focus();
        }
      } else if (e.key === 'Escape') {
        if (document.activeElement === searchRef.current) {
          setSearch('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const semesterFilteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedSemester !== 'all' && c.semester !== selectedSemester) {
        return false;
      }
      return true;
    });
  }, [courses, selectedSemester]);

  const displayCourses = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    let result = semesterFilteredCourses;
    if (query) {
      result = semesterFilteredCourses.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query)
      );
    }

    if (sortOrder === 'asc') {
      return [...result].sort((a, b) => a.score - b.score);
    } else if (sortOrder === 'desc') {
      return [...result].sort((a, b) => b.score - a.score);
    }
    return result;
  }, [semesterFilteredCourses, debouncedSearch, sortOrder]);

  const currentStats = useMemo(
    () => calcStats(semesterFilteredCourses),
    [semesterFilteredCourses]
  );

  const gradeDistribution = useMemo(() => {
    return GRADES.map((g) => {
      const count = semesterFilteredCourses.reduce((sum, c) => {
        return getGrade(c.score).letter === g.letter ? sum + 1 : sum;
      }, 0);
      return { letter: g.letter, count };
    });
  }, [semesterFilteredCourses]);

  const handleScore = useCallback(
    (id, score) => {
      dispatch(setScore({ id, score }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id, name) => {
      const targetCourse = courses.find((c) => c.id === id);
      if (targetCourse) {
        setLastDeleted(targetCourse);
      }
      dispatch(removeCourse(id));
      showNotice(`Đã xóa môn ${name}`);
    },
    [courses, dispatch, showNotice]
  );

  const handleUndo = () => {
    if (lastDeleted) {
      dispatch(addCourse(lastDeleted));
      showNotice(`Đã hoàn tác: ${lastDeleted.name}`);
      setLastDeleted(null);
    }
  };

  const handleResetSample = () => {
    if (data) {
      dispatch(setCourses(data));
      showNotice('Đã đặt lại dữ liệu mẫu');
    } else {
      fetch('/data/courses.json')
        .then((res) => res.json())
        .then((json) => {
          dispatch(setCourses(json));
          showNotice('Đã đặt lại dữ liệu mẫu');
        })
        .catch(() => {});
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Mã môn',
      'Tên môn',
      'Tín chỉ',
      'Học kỳ',
      'Điểm hệ 10',
      'Điểm chữ',
      'Điểm hệ 4',
    ];
    const rows = displayCourses.map((c) => {
      const g = getGrade(c.score);
      return [
        `"${c.code}"`,
        `"${c.name}"`,
        c.credits,
        `"${c.semester}"`,
        c.score,
        `"${g.letter === 'F' ? 'F – Học lại' : g.letter}"`,
        g.point.toFixed(1),
      ].join(',');
    });
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bang_diem.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSort = () => {
    setSortOrder((prev) => {
      if (prev === 'none') return 'desc';
      if (prev === 'desc') return 'asc';
      return 'none';
    });
  };

  if (!hasSaved && loading) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <p>Đang tải bảng điểm...</p>
      </div>
    );
  }

  if (!hasSaved && error) {
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

      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-info">
            <h2>Thống kê</h2>
            <p>Số môn: {currentStats.count}</p>
            <p>Tổng tín chỉ: {currentStats.credits}</p>
            <p>GPA (hệ 4): {currentStats.gpa.toFixed(2)}</p>
            <p>Xếp loại: {currentStats.rank}</p>
            <p>GPA tích lũy: {totalStats.gpa.toFixed(2)}</p>
          </div>

          <div className="grade-distribution">
            <h3>Phân bố điểm chữ</h3>
            <ul className="grade-chart">
              {gradeDistribution.map(({ letter, count }) => (
                <li key={letter} className="grade-col">
                  <div className="bar-wrapper">
                    <span
                      className="grade-bar"
                      style={{
                        height: `${count * 24}px`,
                      }}
                    />
                  </div>
                  <span className="grade-text">{letter}: {count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="controls-section">
        <div>
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

        <div>
          <label htmlFor="search-course">Tìm môn học</label>
          <input
            id="search-course"
            ref={searchRef}
            type="text"
            value={search}
            onChange={handleCourseShift}
            placeholder="Tìm theo tên hoặc mã môn..."
          />
        </div>
      </div>

      <p>Tìm thấy {displayCourses.length} môn</p>

      {courses.length === 0 ? (
        <p>Chưa có môn học nào</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn</th>
                <th>Tín chỉ</th>
                <th>Học kỳ</th>
                <th
                  onClick={toggleSort}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  title="Bấm để sắp xếp theo điểm"
                >
                  Điểm (hệ 10){' '}
                  {sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '↕'}
                </th>
                <th>Điểm chữ</th>
                <th>Điểm (hệ 4)</th>
                <th>Số lần render</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {displayCourses.map((c) => (
                <CourseRow
                  key={c.id}
                  course={c}
                  onScore={handleScore}
                  onRemove={handleRemove}
                />
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleResetSample}
            >
              Đặt lại dữ liệu mẫu
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportCSV}
            >
              Xuất CSV
            </button>
            {lastDeleted && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleUndo}
              >
                Hoàn tác xóa {lastDeleted.name}
              </button>
            )}
          </div>
        </>
      )}

      <AddCourseForm />

      <GoalPlanner />
    </div>
  );
}

export default App;
