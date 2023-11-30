import React, { useState, useEffect, useRef } from 'react';
import '@css/timer.css';
const Timer = React.forwardRef((props, ref) => {
  const timerRef = useRef(null);
  const [times, setTime] = useState(180);
  const [maxTime] = useState(180); // 最大時間を設定 (秒)
  const timerBarRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(400);
  
  useEffect(() => {
    if (ref) {
      if (times <= 0) {
        ref.current = {
          times: 0,
        };
      } else {
        ref.current = {
          times: times,
        };
      }
    }
  }, [ref, times]);

  useEffect(() => {
    if (timerBarRef.current) {
      setMaxWidth(timerBarRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    const updateMaxWidth = () => {
      if (timerBarRef.current) {
        setMaxWidth(timerBarRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', updateMaxWidth);

    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  const animationDuration = 180; // アニメーションの時間（秒）

  useEffect(() => {
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000; // 経過時間（秒）

      if (elapsedTime < animationDuration) {
        const animatedWidth = maxWidth - (maxWidth / animationDuration) * elapsedTime;
        timerBarRef.current.style.width = `${Math.max(animatedWidth, 0)}px`;

        // 1秒ごとにtimesを減少させる
        const remainingTime = Math.max(Math.ceil(maxTime - elapsedTime), 0);
        if (remainingTime !== 0) {
          setTime(remainingTime);
        }else{
          timerBarRef.current.style.width = '0px';
          setTime(0);
        }
        requestAnimationFrame(animate);
      } else {
        
      }
    };

    animate();
  }, [maxWidth]);

  return (
    <div
      className="timer-wrap"
      style={{
        width: `${maxWidth}px`,
        minHeight: '20px',
        borderRadius: '4px',
        position: 'relative',
        transition: 'width 1s', // トランジションの設定
      }}
      ref={timerBarRef}
    >
      <div
        className="timer-bar"
        style={{
          position: 'absolute',
          top: '0',
          height: '20px',
          backgroundColor: '#fff',
          opacity: '0.5',
          borderRadius: '4px',
          width: `${maxWidth}px`,
        }}
      />
      <div
        className="timer-bar"
        style={{
          position: 'absolute',
          height: '20px',
          backgroundColor: '#ff0000',
          borderRadius: '6px',
          width: '100%', // 最初は100%で表示
          transition: 'width 1s', // トランジションの設定
        }}
      />
      <div
        className="timer-text"
        style={{
          position: 'absolute',
          height: '20px',
          top: '0',
          left: '10px',
          margin: '0',
          padding: '0',
          fontSize: '12px',
          width: `${maxWidth}px`,
          textAlign: 'left',
          fontWeight: 'bold',
          color: '#fff',
          zIndex: 3,
        }}
      >
        <p ref={timerRef}>残り時間{times}秒</p>
      </div>
    </div>
  );
});

export default Timer;
