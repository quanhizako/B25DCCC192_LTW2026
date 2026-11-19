import { GRADES, RANKS } from './data';

export const getGrade = (score) => {
  return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1];
};

export const getRank = (gpa) => {
  if (gpa === null || gpa === undefined) return 'Chưa xếp loại';
  const found = RANKS.find((r) => gpa >= r.min);
  return found ? found.title : 'Chưa xếp loại';
};

export const calcStats = (courses) => {
  if (!courses || courses.length === 0) {
    return {
      count: 0,
      credits: 0,
      points: 0,
      gpa: 0,
      rank: 'Chưa xếp loại',
    };
  }

  const count = courses.length;
  const credits = courses.reduce((sum, c) => sum + Number(c.credits), 0);
  const points = courses.reduce(
    (sum, c) => sum + Number(c.credits) * getGrade(c.score).point,
    0
  );
  const gpa = credits === 0 ? 0 : Math.round((points / credits) * 100) / 100;
  const rank = credits === 0 ? 'Chưa xếp loại' : getRank(gpa);

  return { count, credits, points, gpa, rank };
};

export const calcRequired = (courses, target, remaining) => {
  const targetNum = parseFloat(target);
  const remNum = Number(remaining);

  const isTargetValid =
    target !== '' && !isNaN(targetNum) && targetNum >= 0 && targetNum <= 4;
  const isRemValid =
    remaining !== '' &&
    !isNaN(remNum) &&
    Number.isInteger(remNum) &&
    remNum >= 1;

  if (!isTargetValid || !isRemValid) {
    return 'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)';
  }

  const stats = calcStats(courses);
  const earnedCredits = stats.credits;
  const earnedPoints = stats.points;

  const need = (targetNum * (earnedCredits + remNum) - earnedPoints) / remNum;

  if (need > 4) {
    return 'Không thể đạt mục tiêu này';
  }

  if (need <= 0) {
    return 'Bạn đã đạt mục tiêu';
  }

  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${remNum} tín chỉ còn lại`;
};
