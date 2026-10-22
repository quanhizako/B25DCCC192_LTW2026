import React from 'react';
import { LETTERS } from '../data';

const AudienceChart = ({ votes }) => {
  if (!votes) {
    return null;
  }

  return (
    <div className="audience-chart-card">
      <h4 className="chart-title">Ý kiến khán giả</h4>
      <div className="bars-container">
        {LETTERS.map((letter, index) => {
          const percent = votes[index] || 0;
          return (
            <div key={letter} className="bar-wrapper">
              <div
                className="audience-bar"
                style={{
                  width: `${percent}%`,
                }}
              >
                {`${letter}: ${percent}%`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudienceChart;
