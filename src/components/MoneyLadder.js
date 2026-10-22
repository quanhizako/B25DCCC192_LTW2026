import React from 'react';
import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ currentQuestionIndex }) => {
  const ladderItems = [...PRIZES]
    .map((prize, index) => ({
      questionNumber: index + 1,
      prize,
      isMilestone: MILESTONES.includes(index + 1),
      isActive: index === currentQuestionIndex,
      isPassed: index < currentQuestionIndex,
    }))
    .reverse();

  return (
    <div className="money-ladder-container">
      <h4 className="ladder-title">Thang tiền thưởng</h4>
      <ul className="ladder-list">
        {ladderItems.map((item) => {
          let itemClass = 'ladder-item';
          if (item.isActive) itemClass += ' active-step';
          if (item.isMilestone) itemClass += ' milestone-step';
          if (item.isPassed) itemClass += ' passed-step';

          return (
            <li key={item.questionNumber} className={itemClass}>
              <span className="ladder-step-num">{item.questionNumber}</span>
              <span className="ladder-step-prize">
                {formatMoney(item.prize)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MoneyLadder;
