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
