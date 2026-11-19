import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    setCourses: (state, action) => {
      return action.payload;
    },
    addCourse: (state, action) => {
      const nextId = state.reduce((max, c) => Math.max(max, c.id), 0) + 1;
      state.push({ ...action.payload, id: nextId });
    },
    removeCourse: (state, action) => {
      return state.filter((c) => c.id !== action.payload);
    },
    setScore: (state, action) => {
      const { id, score } = action.payload;
      const course = state.find((c) => c.id === id);
      if (course) {
        course.score = score;
      }
    },
  },
});

export const { setCourses, addCourse, removeCourse, setScore } = coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;
