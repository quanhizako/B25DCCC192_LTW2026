import React from 'react';

// Component Cháu: hiển thị chi tiết từng dòng dữ liệu sinh viên
const StudentItem = ({ student, onDelete }) => {
  // Dùng Destructuring Assignment để bóc tách
  const { id, name, score, studentClass } = student;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{studentClass}</td>
      <td>
        <button className="btn-delete" onClick={() => onDelete(id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;
