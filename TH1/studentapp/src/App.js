import React, { useState } from 'react';
import './App.css';
import StudentList from './StudentList';
const App = () => {
  const initialStudents = [
    { id: 1, name: 'Nguyễn Văn A', score: 8.5, studentClass: 'IT1' },
    { id: 2, name: 'Trần Thị B', score: 4.0, studentClass: 'IT2' },
    { id: 3, name: 'Lê Văn C', score: 9.0, studentClass: 'IT1' },
    { id: 4, name: 'Phạm Thị D', score: 6.5, studentClass: 'IT3' },
  ];
  const [students, setStudents] = useState(initialStudents);
  // state bộ lọc 
  const [filterType, setFilterType] = useState('ALL');
  // state tạo form nhập liêu-->>
  const [nameInput, setNameInput] = useState('');
  const [scoreInput, setScoreInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // hàm để kiểm tra lỗi khi nhập liệu 
  const handleAddStudent = () => {
    // kiểm tra lỗi ràng buộc chung 
    if (!nameInput.trim() || !scoreInput.trim() || !classInput.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin (Họ tên, Điểm số, Lớp)!');
      return;
    }

    const scoreNum = parseFloat(scoreInput);

    // kiểm tra lỗi ràng buộc của score (0-10)
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setErrorMsg('Điểm số không hợp lệ (phải từ 0 đến 10)!');
      return;
    }

    // set lại thông báo error
    setErrorMsg('');

    const newStudent = {
      id: Date.now(),
      name: nameInput.trim(),
      score: scoreNum,
      studentClass: classInput.trim(),
    };
    setStudents([...students, newStudent]);
    // reset form 
    setNameInput('');
    setScoreInput('');
    setClassInput('');
  };

  // xóa sinh viên — dùng .filter()
  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  // lọc danh sách sinh viên theo score —.filter()
  const filteredStudents = students.filter((student) => {
    if (filterType === 'EXCELLENT') return student.score >= 8;
    if (filterType === 'FAILED') return student.score < 5;
    return true; // ALL
  });

  //  tính thống kê—.reduce()
  const totalStudents = filteredStudents.length;
  const averageScore =
    totalStudents > 0
      ? (
        filteredStudents.reduce((sum, student) => sum + student.score, 0) /
        totalStudents
      ).toFixed(2)
      : 0;

  const passedStudents = filteredStudents.filter(student => student.score >= 5).length;
  const failedStudents = filteredStudents.filter(student => student.score < 5).length;

  return (
    <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>

      {/* form thêm sinh viên */}
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

      {/* hiển thị lỗi nếu có lỗi */}
      {errorMsg && <div className="error">{errorMsg}</div>}

      {/* bộ lọc — dùng Template Literals để nối chuỗi className */}
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

      {/* bảng danh sách — truyền props xuống component con */}
      <StudentList students={filteredStudents} onDelete={handleDeleteStudent} />

      {/* Thống kê */}
      <div className="stats">
        <span>
          <strong>Tổng số sinh viên:</strong> {totalStudents}
        </span>
        <span>
          <strong>Điểm trung bình:</strong> {averageScore}
        </span>
        <span>
          <strong>Số SV đỗ:</strong> {passedStudents}
        </span>
        <span>
          <strong>Số SV trượt:</strong> {failedStudents}
        </span>
      </div>
    </div>
  );
};

export default App;
