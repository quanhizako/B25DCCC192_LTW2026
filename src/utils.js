import { PRIZES, MILESTONES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (correctCount === 0) {
    return 0;
  }

  if (reason === 'win' || reason === 'stop') {
    return PRIZES[correctCount - 1] || 0;
  }

  const passedMilestones = MILESTONES.filter((m) => m <= correctCount);
  if (passedMilestones.length === 0) {
    return 0;
  }

  const highestMilestone = passedMilestones[passedMilestones.length - 1];
  return PRIZES[highestMilestone - 1] || 0;
};

export const generateAudienceVotes = (correctIndex, hiddenIndices = []) => {
  const visibleIndices = [0, 1, 2, 3].filter(
    (idx) => !hiddenIndices.includes(idx)
  );

  const correctPercent =
    Math.floor(Math.random() * (70 - 40 + 1)) + 40;
  let remaining = 100 - correctPercent;

  const wrongVisible = visibleIndices.filter((idx) => idx !== correctIndex);
  const votes = { 0: 0, 1: 0, 2: 0, 3: 0 };
  votes[correctIndex] = correctPercent;

  if (wrongVisible.length === 1) {
    votes[wrongVisible[0]] = remaining;
  } else if (wrongVisible.length > 1) {
    for (let i = 0; i < wrongVisible.length - 1; i++) {
      const share = Math.floor(Math.random() * (remaining + 1));
      votes[wrongVisible[i]] = share;
      remaining -= share;
    }
    votes[wrongVisible[wrongVisible.length - 1]] = remaining;
  }

  return votes;
};
