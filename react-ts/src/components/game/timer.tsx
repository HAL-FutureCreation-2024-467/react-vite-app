import React, { useState, useEffect, useRef } from 'react';

const Timer = React.forwardRef((props, ref) => {
  const timerRef = useRef(null);
  const [times, setTime] = useState(3);
  const [maxTime] = useState(180); // 最大時間を設定 (秒)
  const timerBarRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(400);

  useEffect(() => {
    if (ref) {
      ref.current = {
        // 親コンポーネントからtimesを参照可能に設定
        times: times,
        // 他のメソッドやプロパティも追加可能
      };
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 0.1 : maxTime)); // 0になったら最大値に戻る
    }, 100);
    // タイマーを止める処理
    if(times === 0){
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [maxTime]);

  const decreasePerSecond = maxWidth / maxTime; // 1秒ごとの減少量を計算
  const width = Math.max(times * decreasePerSecond, 0); // ゲージの幅を計算

  //秒数が0になった際にタイマーを止める

  return (
    <div
      className="timer-wrap"
      style={{
        width: `${maxWidth}px`,
        minHeight: '20px',
        borderRadius: '4px',
        position: 'relative',
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
          width: `${width}px`,
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
        <p ref={timerRef}>残り時間{Math.floor(times)}秒</p>
      </div>
    </div>
  );
});

export default Timer;
