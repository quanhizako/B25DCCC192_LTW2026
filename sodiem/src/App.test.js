import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

const mockCourses = [
  { id: 1, code: 'MH101', name: 'Giải tích 1', credits: 3, semester: 'Học kỳ 1', score: 7.5 },
  { id: 2, code: 'MH102', name: 'Vật lý đại cương', credits: 3, semester: 'Học kỳ 1', score: 6.2 },
  { id: 3, code: 'MH103', name: 'Tin học cơ sở', credits: 2, semester: 'Học kỳ 1', score: 9.4 },
  { id: 4, code: 'MH104', name: 'Lập trình C++', credits: 3, semester: 'Học kỳ 1', score: 8.8 },
  { id: 5, code: 'MH201', name: 'Giải tích 2', credits: 3, semester: 'Học kỳ 2', score: 5.8 },
  { id: 6, code: 'MH202', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, semester: 'Học kỳ 2', score: 8.1 },
  { id: 7, code: 'MH203', name: 'Đại số tuyến tính', credits: 3, semester: 'Học kỳ 2', score: 7.0 },
  { id: 8, name: 'Kỹ năng giao tiếp', code: 'MH204', credits: 2, semester: 'Học kỳ 2', score: 9.0 },
  { id: 9, code: 'MH301', name: 'Cơ sở dữ liệu', credits: 3, semester: 'Học kỳ 3', score: 8.4 },
  { id: 10, code: 'MH302', name: 'Mạng máy tính', credits: 3, semester: 'Học kỳ 3', score: 6.9 },
  { id: 11, code: 'MH303', name: 'Lập trình hướng đối tượng', credits: 3, semester: 'Học kỳ 3', score: 3.8 },
  { id: 12, code: 'MH304', name: 'Lập trình web', credits: 3, semester: 'Học kỳ 3', score: 9.6 },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCourses),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Bai 1: loads courses and displays initial statistics', async () => {
  render(<App />);

  expect(screen.getByText('Đang tải bảng điểm...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  });

  expect(screen.getByText('Tổng tín chỉ: 34')).toBeInTheDocument();
  expect(screen.getByText('GPA (hệ 4): 2.87')).toBeInTheDocument();
  expect(screen.getByText('Xếp loại: Khá')).toBeInTheDocument();
  expect(screen.getByText('GPA tích lũy: 2.87')).toBeInTheDocument();

  // Check F course
  expect(screen.getByText('F – Học lại')).toBeInTheDocument();
});

test('Bai 1: form validation on empty submit', async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  });

  const submitBtn = screen.getByRole('button', { name: 'Thêm môn' });
  fireEvent.click(submitBtn);

  expect(screen.getByText('Hãy nhập mã môn')).toBeInTheDocument();
  expect(screen.getByText('Hãy nhập tên môn')).toBeInTheDocument();
  expect(screen.getByText('Điểm phải từ 0 đến 10')).toBeInTheDocument();
});
