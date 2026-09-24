import React, { useState } from 'react';
import './App.css';
import StudentList from './StudentList';

// Component Cha: quản lý state chính gồm danh sách sinh viên và bộ lọc
const App = () => {
  // Mảng dữ liệu mẫu ban đầu (tối thiểu 3 sinh viên)
  const initialStudents = [
    { id: 1, name: 'Nguyễn Văn A', score: 8.5, studentClass: 'IT1' },
    { id: 2, name: 'Trần Thị B', score: 4.0, studentClass: 'IT2' },
    { id: 3, name: 'Lê Văn C', score: 9.0, studentClass: 'IT1' },
    { id: 4, name: 'Phạm Thị D', score: 6.5, studentClass: 'IT3' },
  ];

  // State danh sách sinh viên
  const [students, setStudents] = useState(initialStudents);
  // State bộ lọc
  const [filterType, setFilterType] = useState('ALL');
  // State form nhập liệu
  const [nameInput, setNameInput] = useState('');
  const [scoreInput, setScoreInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hàm thêm sinh viên mới
  const handleAddStudent = () => {
    // Kiểm tra ràng buộc: không để trống
    if (!nameInput.trim() || !scoreInput.trim() || !classInput.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin (Họ tên, Điểm số, Lớp)!');
      return;
    }

    const scoreNum = parseFloat(scoreInput);

    // Kiểm tra ràng buộc: điểm số phải hợp lệ (0-10)
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setErrorMsg('Điểm số không hợp lệ (phải từ 0 đến 10)!');
      return;
    }

    // Xóa thông báo lỗi
    setErrorMsg('');

    const newStudent = {
      id: Date.now(), // Tạo ID duy nhất
      name: nameInput.trim(),
      score: scoreNum,
      studentClass: classInput.trim(),
    };

    // Cập nhật danh sách — không mất dữ liệu cũ
    setStudents([...students, newStudent]);

    // Reset form
    setNameInput('');
    setScoreInput('');
    setClassInput('');
  };

  // Hàm xóa sinh viên — dùng .filter()
  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  // Lọc danh sách theo bộ lọc hiện tại — dùng .filter()
  const filteredStudents = students.filter((student) => {
    if (filterType === 'EXCELLENT') return student.score >= 8;
    if (filterType === 'FAILED') return student.score < 5;
    return true; // ALL
  });

  // Tính thống kê — dùng .reduce()
  const totalStudents = filteredStudents.length;
  const averageScore =
    totalStudents > 0
      ? (
          filteredStudents.reduce((sum, student) => sum + student.score, 0) /
          totalStudents
        ).toFixed(2)
      : 0;

  return (
    <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>

      {/* Form thêm sinh viên */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Họ tên"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          type="number"
          placeholder="Điểm số"
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value)}
          step="0.1"
          min="0"
          max="10"
        />
        <input
          type="text"
          placeholder="Lớp"
          value={classInput}
          onChange={(e) => setClassInput(e.target.value)}
        />
        <button className="btn-add" onClick={handleAddStudent}>
          Thêm
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {errorMsg && <div className="error">{errorMsg}</div>}

      {/* Bộ lọc — dùng Template Literals để nối chuỗi className */}
      <div className="filters">
        <button
          className={`btn-filter ${filterType === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          Tất cả
        </button>
        <button
          className={`btn-filter ${filterType === 'EXCELLENT' ? 'active' : ''}`}
          onClick={() => setFilterType('EXCELLENT')}
        >
          Giỏi (≥ 8)
        </button>
        <button
          className={`btn-filter ${filterType === 'FAILED' ? 'active' : ''}`}
          onClick={() => setFilterType('FAILED')}
        >
          Trượt (&lt; 5)
        </button>
      </div>

      {/* Bảng danh sách — truyền props xuống component con */}
      <StudentList students={filteredStudents} onDelete={handleDeleteStudent} />

      {/* Thống kê */}
      <div className="stats">
        <span>
          <strong>Tổng số sinh viên:</strong> {totalStudents}
        </span>
        <span>
          <strong>Điểm trung bình:</strong> {averageScore}
        </span>
      </div>
    </div>
  );
};

export default App;
