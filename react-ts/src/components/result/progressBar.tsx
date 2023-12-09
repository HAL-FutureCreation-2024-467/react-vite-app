import React, { useEffect, useState } from 'react';

const ProgressBar = (props: { currentExp: number; nextRankExp: number; rankDiff: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const expDiff = props.rankDiff;
    const nextExp = props.nextRankExp;
    const currentExp = props.currentExp;
    const targetWidth = Number(100 -(expDiff / (nextExp - currentExp)) * 100);

    let intervalId: NodeJS.Timeout;

    if (width < targetWidth) {
      intervalId = setInterval(() => {
        setWidth((prevWidth) => Math.min(prevWidth + 0.2, targetWidth));
      }, 16);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [props.currentExp, props.nextRankExp, props.rankDiff, width]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${width}%` }}></div>
    </div>
  );
};

export default ProgressBar;
