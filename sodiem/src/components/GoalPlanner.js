import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCourses } from '../features/coursesSlice';
import { selectGoal, setTarget, setRemaining } from '../features/goalSlice';
import { calcRequired } from '../utils';

export const GoalPlanner = () => {
  const courses = useSelector(selectCourses);
  const { target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const result = useMemo(() => {
    return calcRequired(courses, target, remaining);
  }, [courses, target, remaining]);

  return (
    <section className="goal-planner">
      <h2>Mục tiêu GPA</h2>
      <div className="form-group">
        <label htmlFor="goal-target">GPA mục tiêu</label>
        <input
          id="goal-target"
          type="number"
          step="0.01"
          value={target}
          onChange={(e) => dispatch(setTarget(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="goal-remaining">Số tín chỉ còn lại</label>
        <input
          id="goal-remaining"
          type="number"
          value={remaining}
          onChange={(e) => dispatch(setRemaining(e.target.value))}
        />
      </div>
      <p className="goal-result">{result}</p>
    </section>
  );
};
