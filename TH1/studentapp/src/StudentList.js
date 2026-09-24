import React from 'react';
import StudentItem from './StudentItem';

// Component Con: nhận danh sách sinh viên qua props để hiển thị bảng
const StudentList = ({ students, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Điểm số</th>
          <th>Lớp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {students.length > 0 ? (
          // Dùng .map() để render danh sách
          students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onDelete={onDelete}
            />
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>
              Không có dữ liệu sinh viên.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StudentList;
