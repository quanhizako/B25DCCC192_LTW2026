import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import { NoticeProvider } from './context/NoticeContext';

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

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <NoticeProvider>
          <App />
        </NoticeProvider>
      </ThemeProvider>
    </Provider>
  );
};

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

test('Bai 2: Theme toggle works', async () => {
  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  });

  const themeBtn = screen.getByRole('button', { name: 'Chế độ tối' });
  fireEvent.click(themeBtn);
  expect(screen.getByRole('button', { name: 'Chế độ sáng' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Chế độ sáng' }));
  expect(screen.getByRole('button', { name: 'Chế độ tối' })).toBeInTheDocument();
});

test('Bai 2: GoalPlanner calculations', async () => {
  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  });

  // Initial target 3.2, remaining 20 -> Cần đạt trung bình 3.76 điểm (hệ 4) ở 20 tín chỉ còn lại
  expect(
    screen.getByText('Cần đạt trung bình 3.76 điểm (hệ 4) ở 20 tín chỉ còn lại')
  ).toBeInTheDocument();

  // Change target to 2.5
  const targetInput = screen.getByLabelText('GPA mục tiêu');
  fireEvent.change(targetInput, { target: { value: '2.5' } });
  expect(
    screen.getByText('Cần đạt trung bình 1.87 điểm (hệ 4) ở 20 tín chỉ còn lại')
  ).toBeInTheDocument();

  // Target 4, remaining 3
  const remInput = screen.getByLabelText('Số tín chỉ còn lại');
  fireEvent.change(targetInput, { target: { value: '4' } });
  fireEvent.change(remInput, { target: { value: '3' } });
  expect(screen.getByText('Không thể đạt mục tiêu này')).toBeInTheDocument();

  // Target 1, remaining 20
  fireEvent.change(targetInput, { target: { value: '1' } });
  fireEvent.change(remInput, { target: { value: '20' } });
  expect(screen.getByText('Bạn đã đạt mục tiêu')).toBeInTheDocument();
});
