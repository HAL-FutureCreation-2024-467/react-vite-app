import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD

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
=======
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
>>>>>>> origin/dev
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

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/dev

  return (
    <div
      className="timer-wrap"
      style={{
        width: `${maxWidth}px`,
        minHeight: '20px',
        borderRadius: '4px',
        position: 'relative',
<<<<<<< HEAD
=======
        transition: 'width 1s', // トランジションの設定
>>>>>>> origin/dev
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
<<<<<<< HEAD
          width: `${width}px`,
=======
          width: '100%', // 最初は100%で表示
          transition: 'width 1s', // トランジションの設定
>>>>>>> origin/dev
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
<<<<<<< HEAD
        <p ref={timerRef}>残り時間{Math.floor(times)}秒</p>
=======
        <p ref={timerRef}>残り時間{times}秒</p>
>>>>>>> origin/dev
      </div>
    </div>
  );
});

export default Timer;
