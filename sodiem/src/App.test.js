import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
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
  localStorage.clear();
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

test('Bai 3: renders courses, statistics, document.title, and grade distribution', async () => {
  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  });

  expect(document.title).toBe('GPA 2.87 – Sổ điểm');

  expect(screen.getByText('Phân bố điểm chữ')).toBeInTheDocument();
  expect(screen.getByText(/A\+: 3/)).toBeInTheDocument();
  expect(screen.getByText(/A: 1/)).toBeInTheDocument();
  expect(screen.getByText(/B\+: 2/)).toBeInTheDocument();
  expect(screen.getByText(/B: 2/)).toBeInTheDocument();
  expect(screen.getByText(/C\+: 1/)).toBeInTheDocument();
  expect(screen.getByText(/C: 2/)).toBeInTheDocument();
  expect(screen.getByText(/D\+: 0/)).toBeInTheDocument();
  expect(screen.getByText(/D: 0/)).toBeInTheDocument();
  expect(screen.getByText(/F: 1/)).toBeInTheDocument();
});

test('Bai 3: search with debounce filters table without affecting statistics', async () => {
  jest.useFakeTimers();
  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  });

  const searchInput = screen.getByLabelText('Tìm môn học');
  fireEvent.change(searchInput, { target: { value: 'lập trình' } });

  expect(screen.getByText('Tìm thấy 12 môn')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(screen.getByText('Tìm thấy 3 môn')).toBeInTheDocument();
  expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  expect(screen.getByText('Tổng tín chỉ: 34')).toBeInTheDocument();

  jest.useRealTimers();
});

test('Bai 3: keyboard shortcut / focuses search and Esc clears it', async () => {
  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText('Số môn: 12')).toBeInTheDocument();
  });

  const searchInput = screen.getByLabelText('Tìm môn học');

  fireEvent.keyDown(window, { key: '/' });
  expect(document.activeElement).toBe(searchInput);

  fireEvent.change(searchInput, { target: { value: 'test' } });
  expect(searchInput.value).toBe('test');

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(searchInput.value).toBe('');
});
